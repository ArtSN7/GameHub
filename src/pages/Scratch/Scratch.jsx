"use client"

import { useState, useEffect } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, Bomb, Plus, Minus, Diamond } from "lucide-react"
import { motion } from "framer-motion"

// Game multipliers
const MULTIPLIERS = {
  LOW: { value: 1.0, rows: 5, cols: 5, bombs: 1 },
  MEDIUM: { value: 1.5, rows: 6, cols: 6, bombs: 2 },
  HIGH: { value: 2.0, rows: 7, cols: 7, bombs: 3 },
}

// Cell states
const CELL_STATE = {
  HIDDEN: "hidden",
  REVEALED: "revealed",
}

// Cell types
const CELL_TYPE = {
  SAFE: "safe",
  BOMB: "bomb",
}

// Game states
const GAME_STATE = {
  READY: "ready",
  PLAYING: "playing",
  WON: "won",
  LOST: "lost",
}

export default function ScratchTheCardPage() {
  const [multiplier, setMultiplier] = useState(MULTIPLIERS.LOW)
  const [grid, setGrid] = useState([])
  const [gameState, setGameState] = useState(GAME_STATE.READY)
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(100)
  const [revealedCount, setRevealedCount] = useState(0)
  const [safeCount, setSafeCount] = useState(0)
  const [message, setMessage] = useState("Reveal cells without hitting bombs")
  const [potentialWin, setPotentialWin] = useState(0)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [multiplier])

  // Calculate potential win
  useEffect(() => {
    setPotentialWin(Math.floor(bet * multiplier.value))
  }, [bet, multiplier])

  // Initialize the game grid
  const initializeGame = () => {
    const { rows, cols, bombs } = multiplier
    const totalCells = rows * cols
    const bombPositions = []

    // Generate random bomb positions
    while (bombPositions.length < bombs) {
      const pos = Math.floor(Math.random() * totalCells)
      if (!bombPositions.includes(pos)) {
        bombPositions.push(pos)
      }
    }

    // Create grid
    const newGrid = []
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        const index = i * cols + j
        let type = CELL_TYPE.SAFE

        if (bombPositions.includes(index)) {
          type = CELL_TYPE.BOMB
        }

        row.push({
          row: i,
          col: j,
          state: CELL_STATE.HIDDEN,
          type,
        })
      }
      newGrid.push(row)
    }

    setGrid(newGrid)
    setGameState(GAME_STATE.READY)
    setRevealedCount(0)
    setSafeCount(totalCells - bombs)
    setMessage("Reveal cells without hitting bombs")
  }

  // Start a new game
  const startGame = () => {
    if (bet > balance) {
      setMessage("Insufficient balance")
      return
    }

    setBalance(balance - bet)
    setGameState(GAME_STATE.PLAYING)
    setMessage("Good luck!")
  }

  // Reveal a cell
  const revealCell = (row, col) => {
    if (gameState !== GAME_STATE.PLAYING) return
    if (grid[row][col].state !== CELL_STATE.HIDDEN) return

    const newGrid = [...grid]
    newGrid[row][col].state = CELL_STATE.REVEALED
    setGrid(newGrid)

    const cell = newGrid[row][col]
    setRevealedCount(revealedCount + 1)

    // Check cell type
    if (cell.type === CELL_TYPE.BOMB) {
      // Game over - hit a bomb
      setGameState(GAME_STATE.LOST)
      setMessage("Boom! You hit a bomb.")
      revealAllBombs()
    }

    // Check if all safe cells are revealed
    if (cell.type === CELL_TYPE.SAFE && revealedCount + 1 >= safeCount) {
      // Win condition
      const winnings = Math.floor(bet * multiplier.value)
      setBalance(balance + winnings)
      setGameState(GAME_STATE.WON)
      setMessage(`You win ${winnings}!`)
    }
  }

  // Reveal all bombs when game is over
  const revealAllBombs = () => {
    const newGrid = [...grid]

    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (newGrid[i][j].type === CELL_TYPE.BOMB) {
          newGrid[i][j].state = CELL_STATE.REVEALED
        }
      }
    }

    setGrid(newGrid)
  }

  // Change multiplier
  const changeMultiplier = (newMultiplier) => {
    if (gameState === GAME_STATE.PLAYING) return
    setMultiplier(newMultiplier)
  }

  // Increase bet
  const increaseBet = () => {
    if (gameState === GAME_STATE.PLAYING) return
    setBet(Math.min(bet + 100, balance))
  }

  // Decrease bet
  const decreaseBet = () => {
    if (gameState === GAME_STATE.PLAYING) return
    setBet(Math.max(bet - 100, 100))
  }

  const handleBetInput = (e) => {
    if (gameState === GAME_STATE.PLAYING) return;
    
    const value = Number(e.target.value);
    setBet(Math.max(0, Math.min(value, balance))); // Enforces minimum bet of 100
  };

  // Render a cell
  const renderCell = (cell) => {
    const { row, col, state, type } = cell

    // Determine cell content based on state and type
    let content = null
    let cellClass = "w-full h-full flex items-center justify-center rounded-lg transition-all"

    if (state === CELL_STATE.HIDDEN) {
      cellClass += " bg-white shadow-sm cursor-pointer hover:bg-blue-50"
    } else if (state === CELL_STATE.REVEALED) {
      if (type === CELL_TYPE.BOMB) {
        content = (
          <div className="text-red-500">
            <Bomb className="h-5 w-5" />
          </div>
        )
        cellClass += " bg-red-100 shadow-inner"
      } else {
        content = (
          <div className="text-blue-500">
            <Diamond className="h-5 w-5" />
          </div>
        )
        cellClass += " bg-blue-100 shadow-inner"
      }
    }

    return (
      <div key={`${row}-${col}`} className="w-12 h-12 p-1" onClick={() => revealCell(row, col)}>
        <motion.div
          className={cellClass}
          initial={state === CELL_STATE.REVEALED ? { rotateY: 180 } : { rotateY: 0 }}
          animate={state === CELL_STATE.REVEALED ? { rotateY: 0 } : { rotateY: 0 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </div>
    )
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
            <Button
              variant="ghost"
              size="icon"
              onClick={initializeGame}
              title="New Game"
              className="text-[#666666] hover:text-blue-500 hover:bg-blue-50"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-md mx-auto">
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Scratch The Card</h1>
        </div>

        {/* Game Message */}
        {message && (
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`py-1.5 px-4 rounded-full text-center text-sm font-medium ${
                gameState === GAME_STATE.WON
                  ? "bg-green-100 text-green-700"
                  : gameState === GAME_STATE.LOST
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {message}
            </motion.div>
          </div>
        )}

        {/* Multiplier Selection */}
        {gameState !== GAME_STATE.PLAYING && (
          <div className="mb-6">
            <div className="flex justify-center gap-2">
              <Button
                variant={multiplier === MULTIPLIERS.LOW ? "default" : "outline"}
                size="sm"
                onClick={() => changeMultiplier(MULTIPLIERS.LOW)}
                className={multiplier === MULTIPLIERS.LOW ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                1.0x
              </Button>
              <Button
                variant={multiplier === MULTIPLIERS.MEDIUM ? "default" : "outline"}
                size="sm"
                onClick={() => changeMultiplier(MULTIPLIERS.MEDIUM)}
                className={multiplier === MULTIPLIERS.MEDIUM ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                1.5x
              </Button>
              <Button
                variant={multiplier === MULTIPLIERS.HIGH ? "default" : "outline"}
                size="sm"
                onClick={() => changeMultiplier(MULTIPLIERS.HIGH)}
                className={multiplier === MULTIPLIERS.HIGH ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                2.0x
              </Button>
            </div>
          </div>
        )}

        {/* Betting Controls */}
        {(gameState === GAME_STATE.READY || gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST) && (
          <div className="mb-6">
            <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                <div className="flex items-center justify-between w-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decreaseBet}
                      disabled={bet <= 100}
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
                      placeholder=""
                      disabled={gameState === GAME_STATE.PLAYING}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={increaseBet}
                      disabled={bet >= balance}
                      className="h-10 w-10 rounded-full text-[#666666] hover:text-blue-500 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

              <div className="text-sm text-[#666666] text-center">
                Potential win: <span className="font-medium text-[#333333]">{potentialWin}</span>
              </div>
            </div>
          </div>
        )}

        {/* Game Grid */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#f1f5f9] p-2 rounded-xl shadow-sm">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell) => renderCell(cell))}
              </div>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center">
          {gameState === GAME_STATE.READY && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
              onClick={startGame}
              disabled={bet > balance}
            >
              Start Game
            </Button>
          )}

          {(gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST) && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
              onClick={initializeGame}
            >
              Play Again
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

