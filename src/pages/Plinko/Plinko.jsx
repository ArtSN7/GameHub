"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Sparkles, Coins } from "lucide-react"
import BettingInput from "../Utils/BettingInput" // Assuming this exists in your project
import Footer from "../Utils/Footer" // Assuming this exists
import InGameHeader from "../Utils/InGameHeader" // Assuming this exists
import { useMediaQuery } from 'react-responsive'

// Game states
const GAME_STATE = {
  IDLE: "idle",
  DROPPING: "dropping",
  COMPLETE: "complete",
}

// Risk levels (inspired by casino payouts)
const RISK_LEVELS = {
  LOW: {
    label: "Low",
    multipliers: [0.5, 1, 1.5, 2, 2.5, 2, 1.5, 1, 0.5],
    gradient: "from-emerald-700 to-green-900",
  },
  MEDIUM: {
    label: "Medium",
    multipliers: [0.2, 0.5, 1, 3, 5, 3, 1, 0.5, 0.2],
    gradient: "from-indigo-700 to-blue-900",
  },
  HIGH: {
    label: "High",
    multipliers: [0, 0.1, 0.5, 2, 10, 2, 0.5, 0.1, 0],
    gradient: "from-fuchsia-700 to-purple-900",
  },
}

export default function Plinko() {
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(100)
  const [gameState, setGameState] = useState(GAME_STATE.IDLE)
  const [riskLevel, setRiskLevel] = useState(RISK_LEVELS.MEDIUM)
  const [ball, setBall] = useState({ x: 50, y: 0, vx: 0, vy: 0 })
  const [pegs, setPegs] = useState([])
  const [finalMultiplier, setFinalMultiplier] = useState(null)
  const [winAmount, setWinAmount] = useState(0)
  const [message, setMessage] = useState("Place your bet and drop the ball!")
  const [lastResults, setLastResults] = useState([])

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" })
  const boardRef = useRef(null)
  const animationFrame = useRef(null)

  // Constants (adapted from BallManager.ts and PegManager.ts)
  const GRAVITY = 0.15
  const BOUNCE = 0.9
  const FRICTION = 0.99
  const BOARD_WIDTH = 100 // Percentage-based
  const BOARD_HEIGHT = 800 // Pixels
  const BALL_SIZE = 28
  const PEG_SIZE = 12
  const ROWS = isMobile ? 14 : 16
  const DROP_ZONE = 90 // Percentage where buckets start

  useEffect(() => {
    generatePegs()
    return () => cancelAnimationFrame(animationFrame.current)
  }, [isMobile])

  const generatePegs = () => {
    const newPegs = []
    for (let row = 0; row < ROWS; row++) {
      const pegsInRow = row + 3
      const offset = row % 2 ? 5 : -5
      for (let col = 0; col < pegsInRow; col++) {
        const x = (col / (pegsInRow - 1)) * BOARD_WIDTH + offset
        const y = (row / (ROWS - 1)) * DROP_ZONE
        newPegs.push({ x: Math.max(5, Math.min(95, x)), y })
      }
    }
    setPegs(newPegs)
  }

  const updateBall = () => {
    let { x, y, vx, vy } = ball
    const deltaTime = 1 // Simplified from repo's deltaTime

    vy += GRAVITY * deltaTime
    vx *= FRICTION
    x += vx * deltaTime
    y += vy * deltaTime

    pegs.forEach((peg) => {
      const dx = x - peg.x
      const dy = y - peg.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const collisionRadius = (BALL_SIZE + PEG_SIZE) / BOARD_HEIGHT * 100

      if (distance < collisionRadius) {
        const angle = Math.atan2(dy, dx)
        const speed = Math.sqrt(vx * vx + vy * vy)
        vx = -Math.cos(angle) * speed * BOUNCE
        vy = -Math.sin(angle) * speed * BOUNCE
        const overlap = collisionRadius - distance
        x += Math.cos(angle) * overlap * 1.2
        y += Math.sin(angle) * overlap * 1.2
      }
    })

    x = Math.max(5, Math.min(95, x))
    if (y >= DROP_ZONE) {
      y = DROP_ZONE
      endDrop(x)
      return
    }

    setBall({ x, y, vx, vy })
    animationFrame.current = requestAnimationFrame(updateBall)
  }

  const dropBall = () => {
    if (gameState !== GAME_STATE.IDLE || bet > balance) {
      setMessage(bet > balance ? "Insufficient funds!" : "Please wait!")
      return
    }

    setBalance((prev) => prev - bet)
    setGameState(GAME_STATE.DROPPING)
    setMessage("Ball in play...")
    setFinalMultiplier(null)
    setWinAmount(0)
    setBall({ x: 50, y: 0, vx: (Math.random() - 0.5) * 1.5, vy: 0 })
    animationFrame.current = requestAnimationFrame(updateBall)
  }

  const endDrop = (finalX) => {
    const slotIndex = Math.floor(finalX / (BOARD_WIDTH / riskLevel.multipliers.length))
    const multiplier = riskLevel.multipliers[slotIndex] || 0
    const win = bet * multiplier

    setFinalMultiplier(multiplier)
    setWinAmount(win)
    setBalance((prev) => prev + win)
    setLastResults((prev) => [multiplier, ...prev.slice(0, 9)])
    setMessage(win > 0 ? `You won ${win} coins!` : "Try your luck again!")
    setGameState(GAME_STATE.COMPLETE)

    setTimeout(() => resetGame(), 2000)
  }

  const resetGame = () => {
    setGameState(GAME_STATE.IDLE)
    setMessage("Place your bet and drop the ball!")
    setBall({ x: 50, y: 0, vx: 0, vy: 0 })
    cancelAnimationFrame(animationFrame.current)
  }

  const renderPeg = (peg) => (
    <div
      key={`${peg.x}-${peg.y}`}
      className="absolute bg-gradient-to-br from-silver-300 to-silver-500 rounded-full shadow-lg"
      style={{
        left: `${peg.x}%`,
        top: `${peg.y}%`,
        width: `${PEG_SIZE}px`,
        height: `${PEG_SIZE}px`,
        transform: "translate(-50%, -50%)",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
      }}
    />
  )

  const renderBucket = (multiplier, index) => (
    <motion.div
      key={index}
      className={`flex-1 h-24 flex items-center justify-center text-white font-extrabold text-xl
        bg-gradient-to-b ${multiplier >= 3 ? 'from-green-800 to-emerald-950' : multiplier > 0 ? 'from-blue-800 to-indigo-950' : 'from-gray-800 to-gray-950'}
        border-t-2 border-b-2 border-gray-900 shadow-inner`}
      animate={finalMultiplier === multiplier ? { 
        scale: [1, 1.4, 1], 
        backgroundColor: ["#fff", multiplier >= 3 ? "#065f46" : multiplier > 0 ? "#1e40af" : "#4b5563", "#fff"],
        transition: { duration: 0.7 }
      } : {}}
    >
      {multiplier}x
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <InGameHeader coins={balance} IsShowGuide={false} title="Plinko" description="Casino-style Plinko action!" />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent tracking-tight">
          Plinko Elite
        </h1>

        <div className="text-center mb-8 text-3xl font-semibold text-gold-300 animate-pulse">
          {message}
        </div>

        <Card className="mb-12 bg-transparent border-4 border-gray-700 shadow-2xl overflow-hidden rounded-3xl">
          <CardContent className="p-0">
            <div
              ref={boardRef}
              className={`relative bg-gradient-to-b ${riskLevel.gradient} h-[800px] rounded-t-3xl overflow-hidden`}
              style={{
                backgroundImage: "radial-gradient(circle at 50% 20%, rgba(255, 215, 0, 0.15), transparent 70%)",
                boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-400/20 to-transparent pointer-events-none" />
              
              {pegs.map(renderPeg)}
              {gameState === GAME_STATE.DROPPING && (
                <motion.div
                  className="absolute bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 rounded-full shadow-xl"
                  style={{
                    left: `${ball.x}%`,
                    top: `${ball.y}%`,
                    width: `${BALL_SIZE}px`,
                    height: `${BALL_SIZE}px`,
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 0 20px rgba(255, 215, 0, 0.9), 0 0 40px rgba(255, 165, 0, 0.6)",
                  }}
                  transition={{ type: "tween", ease: "linear" }}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 flex h-24 bg-gradient-to-t from-gray-950/90 to-transparent">
                {riskLevel.multipliers.map(renderBucket)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12 bg-gray-900/95 border-2 border-gray-800 shadow-xl rounded-2xl">
          <CardContent className="p-8">
            <Tabs
              value={riskLevel.label.toLowerCase()}
              onValueChange={(value) => {
                if (gameState === GAME_STATE.IDLE) {
                  setRiskLevel(RISK_LEVELS[value.toUpperCase()])
                }
              }}
              className="mb-8"
            >
              <TabsList className="grid grid-cols-3 gap-4 bg-gray-950/60 p-3 rounded-xl">
                <TabsTrigger value="low" className="py-4 text-xl font-bold bg-emerald-800/40 data-[state=active]:bg-emerald-700 data-[state=active]:text-white rounded-lg">Low</TabsTrigger>
                <TabsTrigger value="medium" className="py-4 text-xl font-bold bg-indigo-800/40 data-[state=active]:bg-indigo-700 data-[state=active]:text-white rounded-lg">Medium</TabsTrigger>
                <TabsTrigger value="high" className="py-4 text-xl font-bold bg-fuchsia-800/40 data-[state=active]:bg-fuchsia-700 data-[state=active]:text-white rounded-lg">High</TabsTrigger>
              </TabsList>
            </Tabs>

            <BettingInput bet={bet} setBet={setBet} balance={balance} gameState={gameState} />

            <Button
              className="w-full mt-8 bg-gradient-to-r from-gold-500 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-black font-extrabold py-5 text-2xl rounded-xl shadow-lg transition-all duration-300"
              onClick={dropBall}
              disabled={gameState === GAME_STATE.DROPPING || bet > balance}
            >
              <Play className="mr-4 h-7 w-7" />
              {gameState === GAME_STATE.DROPPING ? "Dropping..." : "Drop Ball"}
            </Button>
          </CardContent>
          <CardContent className="flex justify-between p-6 bg-gray-950/70 rounded-b-2xl">
            <div className="flex items-center gap-4">
              <Coins className="h-7 w-7 text-gold-400" />
              <span className="text-2xl font-semibold">Balance: {balance}</span>
            </div>
            {winAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 text-gold-300"
              >
                <Sparkles className="h-7 w-7" />
                <span className="text-2xl font-semibold">Won: {winAmount}</span>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {lastResults.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {lastResults.map((multiplier, i) => (
              <motion.div
                key={i}
                className={`px-6 py-3 rounded-full text-xl font-bold ${
                  multiplier > 1 ? 'bg-emerald-800/60 text-emerald-200' : 'bg-gray-800/60 text-gray-300'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                {multiplier}x
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}