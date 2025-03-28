"use client";

import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import calc_function from "../game/calculate_pattern";
import { pad } from "../game/padding";
import InGameHeader from "../../../Utils/InGameHeader";
import BettingInput from "../../../Utils/BettingInput";
import { Button } from "@/components/ui/button";
import { WIDTH, HEIGHT } from "../game/constants";
 import { motion } from "framer-motion";
 import { useUser } from './../../../../components/App'; // Adjust the path based on your project structure

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
        <li>Sinks have multipliers from 0.5x to 16x.</li>
        <li>Payout: Bet × Multiplier (e.g., 100 bet on 1x = 100).</li>
        <li>Each drop is independent; no bonus rounds.</li>
      </ul>
    </div>
  </>
);

export function Game() {

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const { user, setUser } = useUser(); // Get user context to access user.dbUser.id

  const ballManagerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastFrameTime = useRef(0);

  const [message, setMessage] = useState("Drop some balls!");

  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState("IDLE");
  const [canvasSize, setCanvasSize] = useState({ width: WIDTH, height: HEIGHT });
  const [isLoading, setIsLoading] = useState(false);


  // Fetch user balance from backend
  const fetchUserBalance = async () => {
    if (!user.dbUser?.id) {
      console.error('No user ID available');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/users/${user.dbUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error('Error fetching user balance:', error.message);
      setMessage("Failed to load balance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update user balance on backend
  const updateBackendBalance = async (newBalance) => {
    try {
      const response = await fetch(`${backendUrl}/api/users/${user.dbUser.id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance: newBalance }),
      });
      if (!response.ok) {
        throw new Error('Failed to update balance');
      }
      // Optionally refetch balance to ensure sync
      await fetchUserBalance();
    } catch (error) {
      console.error('Error updating backend balance:', error.message);
      setMessage("Failed to update balance. Please try again.");
    }
  };

  // Fetch balance on component mount
  useEffect(() => {
    fetchUserBalance();
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;

      // Use viewport units for responsive scaling
      const maxWidth = Math.min(container.clientWidth, window.innerWidth * 0.9); // 90% of viewport width
      const maxHeight = window.innerHeight * 0.6; // 60% of viewport height for canvas
      const size = Math.max(300, Math.min(maxWidth, maxHeight, 600)); // Constrain between 300px and 600px
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
      const multiplier = newBallManager.sinks[index].multiplier || 0;
      const payout = Math.round(bet * multiplier);
      setBalance((prev) => {
        const newBalance = prev + payout;
        updateBackendBalance(newBalance); // Update backend after payout
        return newBalance;
      });
      setGameState("IDLE");
      setMessage(`Landed in ${multiplier}x sink!`);
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
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (ballManagerRef.current) ballManagerRef.current.stop();
    };
  }, [canvasSize, bet]);

  const handleAddBall = () => {
    if (!ballManagerRef.current || bet > balance || bet <= 0) return;
    setBalance((prev) => {
      const newBalance = prev - bet;
      updateBackendBalance(newBalance); // Update backend after placing bet
      return newBalance;
    });
    setGameState("DROPPING");
    setMessage(`Dropping...`);

    const response = calc_function();
    const minX = 370;
    const maxX = 430;
    const range = maxX - minX;
    const normalizedX = minX + Math.floor((response.point % range) || 0);
    const startX = pad(normalizedX);
    ballManagerRef.current.addBall(startX);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333] flex flex-col">
      <InGameHeader
        coins={balance}
        IsShowGuide={true}
        title="Plinko"
        description={PlinkoDescription}
      />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-[#333333]">Plinko</h1>
        </div>

        {message && (
           <div className="flex justify-center mb-6">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`py-1.5 px-4 rounded-full text-sm font-medium ${
                   "bg-blue-100 text-blue-700"
               }`}
             >
               {message}
             </motion.div>
           </div>
         )}

        <div className="flex justify-center w-full max-w-[600px] mb-4 md:mb-8">
          <canvas
            ref={canvasRef}
            className="rounded-xl shadow-sm bg-[#f1f5f9] w-full"
          />
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-[400px]">
          <BettingInput
            bet={bet}
            setBet={setBet}
            balance={balance}
            gameState={gameState}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 w-full max-w-[200px] py-2 md:py-3 rounded-lg text-white font-medium text-sm md:text-base"
            onClick={handleAddBall}
            disabled={bet > balance || bet <= 0}
          >
            Drop Ball
          </Button>
        </div>
      </main>
    </div>
  );
}
