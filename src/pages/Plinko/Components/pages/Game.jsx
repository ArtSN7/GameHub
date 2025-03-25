"use client";

import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import calc_function from "../game/calculate_pattern";
import { pad } from "../game/padding";
import { motion } from "framer-motion";
import { Eye, EyeOff, Coins } from "lucide-react";
import InGameHeader from "../../../Utils/InGameHeader";
import BettingInput from "../../../Utils/BettingInput";
import { Button } from "@/components/ui/button";

import { WIDTH, HEIGHT } from "../game/constants";



const PlinkoDescription = (
  <>
    <div>
      <h3 className="text-sm font-medium mb-2">Objective</h3>
      <p className="text-xs text-[#64748b]">
        Drop a ball from the top of the Plinko board to land in a sink at the bottom. Each sink has a multiplier that determines your payout.
      </p>
    </div>
    <div>
      <h3 className="text-sm font-medium mb-2">Rules</h3>
      <ul className="text-xs text-[#64748b] space-y-2">
        <li>Place a bet and drop a ball; it bounces off pegs to a sink.</li>
        <li>Sinks have multipliers from 0.2x to 1000x.</li>
        <li>Payout: Bet × Multiplier (e.g., 100 bet on 2x = 200).</li>
        <li>Each drop is independent; no bonus rounds.</li>
      </ul>
    </div>
    <div>
      <h3 className="text-sm font-medium mb-2">Payouts</h3>
      <ul className="text-xs text-[#64748b] space-y-2">
        <li>Win: Bet × Multiplier (e.g., 100 bet on 1000x = 100,000).</li>
        <li>Loss: Bet lost if multiplier 1x (e.g., 0.2x).</li>
      </ul>
    </div>
    <div>
      <h3 className="text-sm font-medium mb-2">Special Notes</h3>
      <ul className="text-xs text-[#64748b] space-y-2">
        <li>Balls drop between x: 200–600 (top three pegs).</li>
        <li>Edges have higher multipliers (e.g., 1000x), center lower (e.g., 0.2x).</li>
      </ul>
    </div>
  </>
);


export function Game() {
  const ballManagerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastFrameTime = useRef(0);

  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState("IDLE");
  const [message, setMessage] = useState("");
  const [winAmount, setWinAmount] = useState(0);
  const [showPayoutNotes, setShowPayoutNotes] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: WIDTH, height: HEIGHT });

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      const maxWidth = Math.min(container.clientWidth, window.innerHeight * 0.8); // Limit height to 80% of viewport
      const size = Math.max(300, Math.min(maxWidth, 600)); // Min 300px, max 600px
      setCanvasSize({ width: size, height: size });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const newBallManager = new BallManager(canvas, (index, startX) => {
      const multiplier = newBallManager.sinks[index]?.multiplier || 0;
      const payout = bet * multiplier;
      setBalance((prev) => prev + payout);
      setWinAmount(payout);
      setMessage(`Landed in ${multiplier}x sink!`);
      setGameState("IDLE");
    });
    ballManagerRef.current = newBallManager;

    const animate = (timestamp) => {
      if (!lastFrameTime.current || timestamp - lastFrameTime.current >= 16) {
        try {
          if (ballManagerRef.current) {
            ballManagerRef.current.draw();
            if (gameState === "DROPPING" && ballManagerRef.current.getBallCount() === 0) {
              setGameState("IDLE");
            }
          }
        } catch (error) {
          console.error("Animation error:", error);
        }
        lastFrameTime.current = timestamp;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (ballManagerRef.current) {
        ballManagerRef.current.stop();
      }
    };
  }, [canvasSize]); // Re-run when canvas size changes

  const handleAddBall = () => {
    if (!ballManagerRef.current || bet > balance || bet <= 0) {
      setMessage("Invalid bet or insufficient balance!");
      return;
    }
    setBalance((prev) => prev - bet);
    setGameState("DROPPING");
    setMessage("Dropping...");
    setWinAmount(0);

    // from what point i drop the ball
    const response = calc_function();
    const minX = 370;
    const maxX = 430;
    const range = maxX - minX;
    const normalizedX = minX + Math.floor((response.point % range) || 0);
    const startX = pad(normalizedX);
    ballManagerRef.current.addBall(startX);
  };

  const togglePayoutNotes = () => {
    setShowPayoutNotes((prev) => !prev);
  };

  const renderPayoutNotes = () => (
    <div className="bg-[#f1f5f9] p-4 rounded-xl shadow-sm">
      <h3 className="text-sm font-medium mb-2 text-[#333333]">Payouts</h3>
      <ul className="text-xs text-[#666666] space-y-2">
        <li>1000x: Sinks 1, 17</li>
        <li>130x: Sinks 2, 16</li>
        <li>26x: Sinks 3, 15</li>
        <li>9x: Sinks 4, 14</li>
        <li>4x: Sinks 5, 13</li>
        <li>2x: Sinks 6, 12</li>
        <li>0.2x: Sinks 7–11</li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333] flex flex-col">
      <InGameHeader
        coins={balance}
        showGuide={true}
        title="Plinko"
        description={PlinkoDescription}
      />
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Plinko</h1>
        </div>

        {message && (
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`py-1.5 px-4 rounded-full text-sm font-medium ${
                winAmount > bet
                  ? "bg-green-100 text-green-700"
                  : gameState === "DROPPING"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {message} {winAmount > 0 && `(Win: ${winAmount})`}
            </motion.div>
          </div>
        )}

        <div className="mb-8 flex justify-center">
          <canvas
            ref={canvasRef}
            className="rounded-xl shadow-sm bg-[#f1f5f9]"
          />
        </div>

        <div className="flex flex-col items-center gap-6">
          <BettingInput
            bet={bet}
            setBet={setBet}
            balance={balance}
            gameState={gameState}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
            onClick={handleAddBall}
            disabled={gameState === "DROPPING" || bet > balance || bet <= 0}
          >
            {gameState === "DROPPING" ? "Dropping..." : "Drop Ball"}
          </Button>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePayoutNotes}
            className="flex items-center gap-2 text-[#666666] hover:text-blue-500 hover:bg-blue-50"
          >
            {showPayoutNotes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPayoutNotes ? "Hide Payouts" : "Show Payouts"}
          </Button>
        </div>

        {showPayoutNotes && renderPayoutNotes()}
      </main>
    </div>
  );
}
