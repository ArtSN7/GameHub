import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Minus, Coins } from "lucide-react"
import { motion, useAnimation } from "framer-motion"

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
]

// Winning combinations and multipliers
const WINNING_COMBINATIONS = {
  threeOfAKind: 5,
  threeFruits: 2,
  threeHighValue: 3,
}

// Game states
const GAME_STATE = {
  READY: "ready",
  SPINNING: "spinning",
  RESULT: "result",
}

export default function SlotsPage() {
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(1)
  const [gameState, setGameState] = useState(GAME_STATE.READY)
  const [visibleSymbols, setVisibleSymbols] = useState([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[3], SYMBOLS[4], SYMBOLS[5]],
    [SYMBOLS[6], SYMBOLS[7], SYMBOLS[0]],
  ])
  const [finalSymbols, setFinalSymbols] = useState([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[3], SYMBOLS[4], SYMBOLS[5]],
    [SYMBOLS[6], SYMBOLS[7], SYMBOLS[0]],
  ])
  const [spinResult, setSpinResult] = useState(null)
  const [winAmount, setWinAmount] = useState(0)
  const [message, setMessage] = useState("Place your bet and spin")
  const [spinningReels, setSpinningReels] = useState([false, false, false])

  const spinTimersRef = useRef([])
  const reelControls = [useAnimation(), useAnimation(), useAnimation()]

  // Clean up on unmount
  useEffect(() => {
    return () => {
      spinTimersRef.current.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  // Increase bet
  const increaseBet = () => {
    if (gameState === GAME_STATE.SPINNING) return
    setBet(Math.min(bet + 100, balance))
  }

  // Decrease bet
  const decreaseBet = () => {
    if (gameState === GAME_STATE.SPINNING) return
    setBet(Math.max(bet - 100, 100))
  }

  // Get random symbol
  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  }

  // Generate a random reel
  const generateRandomReel = () => {
    return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
  }

  // Spin the reels
  const spin = async () => {
    if (gameState === GAME_STATE.SPINNING) return
    if (bet > balance) {
      setMessage("Insufficient balance")
      return
    }

    spinTimersRef.current.forEach((timer) => clearTimeout(timer))
    spinTimersRef.current = []

    setBalance(balance - bet)
    setGameState(GAME_STATE.SPINNING)
    setMessage("Spinning...")
    setWinAmount(0)
    setSpinResult(null)
    setSpinningReels([true, true, true])

    const newFinalSymbols = [generateRandomReel(), generateRandomReel(), generateRandomReel()]
    setFinalSymbols(newFinalSymbols)

    for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
      // Start spinning
      reelControls[reelIndex].start({
        y: [-64, 0], // Smaller cycle for better performance
        transition: { 
          duration: 0.1, 
          repeat: Infinity, 
          ease: "linear" 
        }
      })

      const timer = setTimeout(async () => {
        // Stop with smooth deceleration
        await reelControls[reelIndex].stop() // Stop the infinite spin
        await reelControls[reelIndex].start({
          y: 0,
          transition: { 
            duration: 0.6, 
            ease: "easeOut", 
            type: "spring", 
            stiffness: 80, 
            damping: 15 
          }
        })

        setSpinningReels((prev) => {
          const newState = [...prev]
          newState[reelIndex] = false
          return newState
        })

        setVisibleSymbols((prev) => {
          const newSymbols = [...prev]
          newSymbols[reelIndex] = newFinalSymbols[reelIndex]
          return newSymbols
        })

        if (reelIndex === 2) {
          setTimeout(() => {
            checkWin(newFinalSymbols)
          }, 500)
        }
      }, 2000 + reelIndex * 1200)

      spinTimersRef.current.push(timer)
    }
  }

  // Check for winning combinations
  const checkWin = (currentReels) => {
    
    const payline = [currentReels[0][1], currentReels[1][1], currentReels[2][1]]
    const isThreeOfAKind = payline[0].id === payline[1].id && payline[1].id === payline[2].id
    const fruitIds = ["cherry", "lemon", "orange", "grape"]
    const isThreeFruits = payline.every((symbol) => fruitIds.includes(symbol.id))
    const highValueIds = ["seven", "bell", "bar", "diamond"]
    const isThreeHighValue = payline.every((symbol) => highValueIds.includes(symbol.id))

    let win = 0
    let resultMessage = "No win. Try again!"
    let result = null

    if (isThreeOfAKind) {
      win = (payline[0].value * bet * WINNING_COMBINATIONS.threeOfAKind) + bet
      resultMessage = `Three ${payline[0].icon}! You win ${win}!`
      result = "threeOfAKind"
    } else if (isThreeFruits) { // three fruits
      win = (bet * WINNING_COMBINATIONS.threeFruits) / 10 + bet
      resultMessage = "Three fruits! You win!"
      result = "threeFruits"
    } else if (isThreeHighValue) { // three high values symbols
      win = (bet * WINNING_COMBINATIONS.threeHighValue) / 2 + bet
      resultMessage = "Three high value symbols! You win!"
      result = "threeHighValue"
    }

    setWinAmount(win)
    setMessage(resultMessage)
    setSpinResult(result)
    setGameState(GAME_STATE.RESULT)

    if (win > 0) {
      setBalance(balance + win)
    }
  }

  // Render a spinning reel with optimized animation
  const renderSpinningReel = (reelIndex) => {
    return (
      <div className="relative w-16 h-48 overflow-hidden bg-[#e2e8f0] rounded-lg">
        <motion.div
          className="absolute inset-0 flex flex-col items-center"
          animate={reelControls[reelIndex]}
          style={{ filter: "blur(1px)" }} // Light blur for realism
        >
          {SYMBOLS.map((symbol, i) => (
            <div
              key={i}
              className="w-16 h-16 flex items-center justify-center text-2xl"
            >
              {symbol.icon}
            </div>
          ))}
        </motion.div>
        <div className="absolute top-1/2 left-0 right-0 h-16 -mt-8 border-y-2 border-blue-200 bg-white/50 z-10"></div>
      </div>
    )
  }

  // Render a static reel
  const renderStaticReel = (reel, reelIndex) => {
    return (
      <div className="bg-[#e2e8f0] rounded-lg overflow-hidden">
        {reel.map((symbol, symbolIndex) => {
          const isMiddle = symbolIndex === 1
          const isWinningSymbol = isMiddle && spinResult && gameState === GAME_STATE.RESULT

          return (
            <div
              key={`${reelIndex}-${symbolIndex}-${symbol.id}`}
              className={`w-16 h-16 flex items-center justify-center text-2xl 
                ${isMiddle ? "border-y-2 border-blue-200 bg-white" : "opacity-50"} 
                ${isWinningSymbol ? "animate-pulse" : ""}`}
            >
              {symbol.icon}
            </div>
          )
        })}
      </div>
    )
  }

  // Handle bet input
  const handleBetInput = (e) => {
    if (gameState === GAME_STATE.SPINNING) return
    const value = Number(e.target.value)
    setBet(Math.max(0, Math.min(value, balance)))
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">
      {/* Header */}
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
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Slots</h1>
        </div>

        {/* Game Message */}
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

        {/* Slot Machine */}
        <div className="mb-8">
          <div className="bg-[#f1f5f9] p-4 rounded-xl shadow-sm">
            {/* Reels */}
            <div className="flex justify-center gap-2 mb-4">
              {spinningReels.map((isSpinning, reelIndex) => (
                <div key={reelIndex}>
                  {isSpinning ? renderSpinningReel(reelIndex) : renderStaticReel(visibleSymbols[reelIndex], reelIndex)}
                </div>
              ))}
            </div>

            {/* Payline Indicator */}
            <div className="flex justify-between px-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>

            {/* Win Amount */}
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

        {/* Betting Controls */}
        <div className="mb-6">
          <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseBet}
                disabled={bet <= 100 || gameState === GAME_STATE.SPINNING}
                className="h-10 w-10 rounded-full text-[#666666] hover:text-blue-500 hover:bg-blue-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                inputMode="numeric"
                value={bet || ""}
                onChange={handleBetInput}
                className="w-20 text-center text-xl font-medium border border-gray-300 rounded-md p-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                disabled={gameState === GAME_STATE.SPINNING}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseBet}
                disabled={bet >= balance || gameState === GAME_STATE.SPINNING}
                className="h-10 w-10 rounded-full text-[#666666] hover:text-blue-500 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
            onClick={spin}
            disabled={gameState === GAME_STATE.SPINNING || bet > balance}
          >
            {gameState === GAME_STATE.SPINNING ? "Spinning..." : "Spin"}
          </Button>
        </div>

      </main>
    </div>
  )
}