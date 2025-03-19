import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Coins, Eye, EyeOff } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import BettingInput from "../Utils/BettingInput";


// Slot symbols with their values
const SYMBOLS = [
  { id: "cherry", icon: "🍒", value: 2 },
  { id: "lemon", icon: "🍋", value: 3 },
  { id: "orange", icon: "🍊", value: 4 },
  { id: "grape", icon: "🍇", value: 5 },
  { id: "seven", icon: "7️⃣", value: 10 },
  { id: "bell", icon: "🔔", value: 8 },
  { id: "bar", icon: "📊", value: 7 },
  { id: "diamond", icon: "💎", value: 15 },
];


// Winning combinations and multipliers
const WINNING_COMBINATIONS = {
  threeOfAKind: 5,
  threeFruits: 2,
  threeHighValue: 4,
};


// Game states
export const GAME_STATE = {
  READY: "ready",
  SPINNING: "spinning",
  RESULT: "result",
};



export default function SlotsPage() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState(GAME_STATE.READY);
  const [reelSymbols, setReelSymbols] = useState([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[3], SYMBOLS[4], SYMBOLS[5]],
    [SYMBOLS[6], SYMBOLS[7], SYMBOLS[0]],
  ]);
  const [spinningReels, setSpinningReels] = useState([]);
  const [spinResult, setSpinResult] = useState(null);
  const [winAmount, setWinAmount] = useState(0);
  const [message, setMessage] = useState("Place your bet and spin");
  const [showPayoutNotes, setShowPayoutNotes] = useState(false); 

  const reelControls = [useAnimation(), useAnimation(), useAnimation()];
  const spinInProgress = useRef(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      reelControls.forEach((control) => control.stop());
    };
  }, []);


  // Get random symbol
  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  // Generate a random reel with more symbols for animation
  const generateSpinningReel = useCallback(() => {
    const reel = [];
    for (let i = 0; i < 30; i++) {
      reel.push(getRandomSymbol());
    }
    return reel;
  }, []);

  // Spin the reels
  const spin = async () => {
    if (gameState === GAME_STATE.SPINNING || spinInProgress.current) return;
    if (bet > balance) {
      setMessage("Insufficient balance");
      return;
    }

    setSpinningReels([]); // Clear spinning reels after animation

    spinInProgress.current = true;
    setBalance(balance - bet);
    setGameState(GAME_STATE.SPINNING);
    setMessage("Spinning...");
    setWinAmount(0);
    setSpinResult(null);

    // Stop any ongoing animations
    reelControls.forEach((control) => control.stop());

    // Generate new spinning reels and final result
    const newSpinningReels = [
      generateSpinningReel(),
      generateSpinningReel(),
      generateSpinningReel(),
    ];
    const finalResult = [
      [newSpinningReels[0][27], newSpinningReels[0][28], newSpinningReels[0][29]],
      [newSpinningReels[1][27], newSpinningReels[1][28], newSpinningReels[1][29]],
      [newSpinningReels[2][27], newSpinningReels[2][28], newSpinningReels[2][29]],
    ];

    // Set spinning reels for animation
    setSpinningReels(newSpinningReels);
    console.log("Set spinning reels:", newSpinningReels.map(reel => reel.map(s => s.icon)));

    // Reset all reels to top position
    for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
      await reelControls[reelIndex].set({ y: 0 });
    }

    // Animate each reel
    for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
      await reelControls[reelIndex].start({
        y: -64 * (newSpinningReels[reelIndex].length - 3),
        transition: {
          duration: 2 + reelIndex * 0.7,
          ease: [0.25, 0.1, 0.25, 1],
        },
      });

      if (reelIndex === 2) {
        setReelSymbols(finalResult); // Set final result after all reels stop
        setTimeout(() => {
          checkWin(finalResult);
          spinInProgress.current = false;
        }, 500);
      }
    }
  };

  // Check for winning combinations
  const checkWin = (currentReels) => {
    const payline = [currentReels[0][1], currentReels[1][1], currentReels[2][1]];
    const isThreeOfAKind = payline[0].id === payline[1].id && payline[1].id === payline[2].id;
    const fruitIds = ["cherry", "lemon", "orange", "grape"];
    const isThreeFruits = payline.every((symbol) => fruitIds.includes(symbol.id));
    const highValueIds = ["seven", "bell", "bar", "diamond"];
    const isThreeHighValue = payline.every((symbol) => highValueIds.includes(symbol.id));

    let win = 0;
    let resultMessage = "No win. Try again!";
    let result = null;

    if (isThreeOfAKind) {
      win = (payline[0].value * bet * WINNING_COMBINATIONS.threeOfAKind) / 10 + bet;
      resultMessage = `Three ${payline[0].icon}! You win ${win}!`;
      result = "threeOfAKind";
    } else if (isThreeFruits) {
      win = (bet * WINNING_COMBINATIONS.threeFruits) / 10 + bet;
      resultMessage = "Three fruits! You win!";
      result = "threeFruits";
    } else if (isThreeHighValue) {
      win = (bet * WINNING_COMBINATIONS.threeHighValue) / 10 + bet;
      resultMessage = "Three high value symbols! You win!";
      result = "threeHighValue";
    }

    setWinAmount(win);
    if (win > 0) { // Add bet amount to balance if won ( win + bet ads to balance )
      setWinAmount(win + bet);
    }
    setMessage(resultMessage);
    setSpinResult(result);
    setGameState(GAME_STATE.RESULT);
    if (win > 0) {
      setBalance(balance + win);
    }
  };

  // Render reel
  const renderReel = (reelIndex) => {
    const isSpinning = spinningReels[reelIndex] && spinningReels[reelIndex].length > 0;
    const symbols = isSpinning ? spinningReels[reelIndex] : reelSymbols[reelIndex] || [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]];
    console.log(`Rendering reel ${reelIndex} (${isSpinning ? "spinning" : "static"}):`, symbols.map(s => s.icon));

    return (
      <div className="relative w-16 h-48 overflow-hidden bg-[#e2e8f0] rounded-lg">
        <motion.div
          className="absolute flex flex-col items-center w-full"
          initial={{ y: 0 }}
          animate={reelControls[reelIndex]}
        >
          {symbols.map((symbol, i) => (
            <div
              key={`${reelIndex}-${i}-${symbol.id}`}
              className="w-16 h-16 flex items-center justify-center text-3xl"
            >
              {symbol.icon}
            </div>
          ))}
        </motion.div>
        <div className="absolute top-1/2 left-0 right-0 h-16 -mt-8 border-y-2 border-blue-200 bg-white/10 z-10 pointer-events-none"></div>
      </div>
    );
  };

  // Toggle payout notes visibility
  const togglePayoutNotes = () => {
    setShowPayoutNotes(!showPayoutNotes);
  };

  // Payout notes component
  const renderPayoutNotes = () => {
    const fruitSymbols = SYMBOLS.filter(s => ["cherry", "lemon", "orange", "grape"].includes(s.id)).map(s => s.icon).join(", ");
    const highValueSymbols = SYMBOLS.filter(s => ["seven", "bell", "bar", "diamond"].includes(s.id)).map(s => s.icon).join(", ");

    return (
      <div className="bg-[#f1f5f9] p-4 rounded-xl shadow-sm mt-4">
        <h2 className="text-lg font-semibold text-[#333333] mb-2">Payout Information</h2>
        <ul className="text-sm text-[#666666] space-y-2">
          <li>
            <strong>Three of a Kind (e.g., 🍒🍒🍒):</strong>
            <br />
            Example: Three 🍒 (value 2) with bet {bet} = {(2 * bet * WINNING_COMBINATIONS.threeOfAKind) + bet}.
          </li>
          <li>
            <strong>Three Fruits ({fruitSymbols}):</strong> 
            <br />
            Example: 🍒🍋🍊 with bet {bet} = {(bet * WINNING_COMBINATIONS.threeFruits) / 10 + bet}.
          </li>
          <li>
            <strong>Three High-Value Symbols ({highValueSymbols}):</strong> 
            <br />
            Example: 7️⃣🔔📊 with bet {bet} = {(bet * WINNING_COMBINATIONS.threeHighValue) / 2 + bet}.
          </li>
        </ul>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center text-[#666666] hover:text-blue-500 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-500 hover:bg-blue-600 py-1.5 px-4 rounded-full">{balance}</Badge>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Slots</h1>
        </div>

        {message && (
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`py-1.5 px-4 rounded-full text-center text-sm font-medium ${
                winAmount > 0
                  ? "bg-green-100 text-green-700"
                  : gameState === GAME_STATE.SPINNING
                    ? "bg-blue-100 text-blue-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {message}
            </motion.div>
          </div>
        )}

        <div className="mb-8">
          <div className="bg-[#f1f5f9] p-4 rounded-xl shadow-sm">
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map((reelIndex) => (
                <div key={reelIndex}>
                  {renderReel(reelIndex)}
                </div>
              ))}
            </div>

            <div className="flex justify-between px-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>

            {winAmount > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex justify-center items-center gap-2 mb-4 py-2 bg-green-100 rounded-lg text-green-700 font-medium"
              >
                <Coins className="h-4 w-4" />
                <span>Win: {winAmount}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Betting Input */}
        <BettingInput bet={bet} setBet={setBet} balance={balance} gameState={gameState} />


        {/* Spin Button */}
        <div className="flex justify-center gap-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
            onClick={spin}
            disabled={gameState === GAME_STATE.SPINNING || bet > balance}
          >
            {gameState === GAME_STATE.SPINNING ? "Spinning..." : "Spin"}
          </Button>
        </div>


      {/* Toggle Button for Payout Notes */}
      <div className="flex justify-center mb-6 mt-4">
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

      {/* Payout Notes Section */}
      {showPayoutNotes && renderPayoutNotes()}

      </main>
    </div>
  );
}