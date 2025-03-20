"use client"

import { useState, useEffect } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, Bomb, Plus, Minus, Diamond } from "lucide-react"
import { motion } from "framer-motion"
import BettingInput from "../Utils/BettingInput"


// Game multipliers
const MULTIPLIERS = {
    LOW: { value: 1.5, rows: 5, cols: 5, bombs: 2 },
    MEDIUM: { value: 2, rows: 6, cols: 6, bombs: 3 },
    HIGH: { value: 3.5, rows: 7, cols: 7, bombs: 4 },
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
  TOOK_LEAVE: "took_leave",
}


export default function ScratchTheCardPage() {
  const [multiplier, setMultiplier] = useState(MULTIPLIERS.LOW) // type of game 
  const [grid, setGrid] = useState([]) // grid of cells

  const [gameState, setGameState] = useState(GAME_STATE.READY)

  const [balance, setBalance] = useState(1000) // balance of the user 
  const [bet, setBet] = useState(100) // initial bet amount 

  const [money_for_reveal_cell, setMoneyForReveal] = useState(0) // winning amount , adjusted every time user opens a cell without hitting a bomb


  const [revealedCount, setRevealedCount] = useState(0) // number of cells revealed
  const [safeCount, setSafeCount] = useState(0)
  const [message, setMessage] = useState("Reveal cells without hitting bombs") // message which will be displayed to the user
  const [potentialWin, setPotentialWin] = useState(0) // potential win amount if all of the safe cells are revealed


  useEffect(() => { // when the multiplier changes, initialize the new grid 
    initializeGame()
  }, [multiplier])

  useEffect(() => { // when the bet or multiplier changes, update the potential win amount
    setPotentialWin(Math.floor(bet * multiplier.value))
  }, [bet, multiplier])

  const changeMultiplier = (newMultiplier) => {
    if (gameState === GAME_STATE.PLAYING) return
    setMultiplier(newMultiplier)
  }

  // initialize the game grid
  const initializeGame = () => {
    const { rows, cols, bombs } = multiplier
    const totalCells = rows * cols
    const bombPositions = []

    while (bombPositions.length < bombs) { // randomly generate bomb positions
      const pos = Math.floor(Math.random() * totalCells)
      if (!bombPositions.includes(pos)) {
        bombPositions.push(pos)
      }
    }

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
    setRevealedCount(0)
    setSafeCount(totalCells - bombs)
    setMessage("Reveal cells without hitting bombs")
  }

  const startGame = () => {
    if (bet > balance) {
      setMessage("Insufficient balance")
      return false
    }

    setBalance(prev => prev - bet)
    setGameState(GAME_STATE.PLAYING)
    setMessage("Good luck!")
    return true
  }

  const playAgain = () => {
    initializeGame()
    if (startGame()) {
    }
  }

    // reveal all the bombs when the game is lost
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

  // reveal a cell and check if the game is won or lost
  const revealCell = (row, col) => {

    // if user is not playing nothing happens
    if (gameState !== GAME_STATE.PLAYING) return 

    // if the cell is already revealed, nothing happens
    if (grid[row][col].state !== CELL_STATE.HIDDEN) return

    const newGrid = [...grid]
    newGrid[row][col].state = CELL_STATE.REVEALED
    setGrid(newGrid)

    const cell = newGrid[row][col]
    setRevealedCount(prev => prev + 1)

    // if not all the cells were opened, then we pay user for another opened cell
    if (cell.type === CELL_TYPE.SAFE && revealedCount + 1 < safeCount) {
      const money_for_reveal = Math.floor(potentialWin / (multiplier.rows * multiplier.cols));

      // Update the total winnings and get the new total
      setMoneyForReveal((prev) => {
        const newTotal = prev + money_for_reveal;
        // Set the message with the current reveal amount and the new total
        setMessage(`You got ${money_for_reveal} for reveal. You already won ${newTotal}`);
        return newTotal;
      });

    console.log(money_for_reveal, moneyForReveal); // Log current reveal and state (before update)
    }

    if (cell.type === CELL_TYPE.BOMB) { // if the cell is a bomb, the game is lost
      setGameState(GAME_STATE.LOST)

      setMoneyForReveal(0) // reset the winning amount to 0

      setMessage("Boom! You lost all of the winnings!")
      revealAllBombs()
    }
  
    // if the user opened all the cells
    if (cell.type === CELL_TYPE.SAFE && revealedCount + 1 >= safeCount) {
      const winnings = Math.floor(bet * multiplier.value)

      setBalance(prev => prev + winnings)

      setGameState(GAME_STATE.WON)
      setMessage(`You win ${winnings}!`)
    }

  }

  // reveal a cell after it has been opened
  const renderCell = (cell) => {
    const { row, col, state, type } = cell
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

  const TakeLeaveFunction = () => {

    setGameState(GAME_STATE.TOOK_LEAVE) // sets the game state to took leave

    setMessage(`You left with ${money_for_reveal_cell}!`)

    setBalance(prev => prev + money_for_reveal_cell) // update the balance

    revealAllBombs() // reveal all the bombs

    setMoneyForReveal(0) // reset the winning amount to 0
  
  }

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Scratch The Card</h1>
        </div>

        {message && (
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`py-1.5 px-4 rounded-full text-center text-sm font-medium ${
                gameState === GAME_STATE.WON || gameState === GAME_STATE.TOOK_LEAVE
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

        {gameState !== GAME_STATE.PLAYING && (
          <div className="mb-6">
            <div className="flex justify-center gap-2">
              <Button
                variant={multiplier === MULTIPLIERS.LOW ? "default" : "outline"}
                size="sm"
                onClick={() => changeMultiplier(MULTIPLIERS.LOW)}
                className={multiplier === MULTIPLIERS.LOW ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                {MULTIPLIERS.LOW.value}x
              </Button>
              <Button
                variant={multiplier === MULTIPLIERS.MEDIUM ? "default" : "outline"}
                size="sm"
                onClick={() => changeMultiplier(MULTIPLIERS.MEDIUM)}
                className={multiplier === MULTIPLIERS.MEDIUM ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                {MULTIPLIERS.MEDIUM.value}x
              </Button>
              <Button
                variant={multiplier === MULTIPLIERS.HIGH ? "default" : "outline"}
                size="sm"
                onClick={() => changeMultiplier(MULTIPLIERS.HIGH)}
                className={multiplier === MULTIPLIERS.HIGH ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                {MULTIPLIERS.HIGH.value}x
              </Button>
            </div>
          </div>
        )}

        {(gameState === GAME_STATE.READY || gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST) && (
          <div className="mb-6">
            <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
              {/* Betting Input */}
              <BettingInput bet={bet} setBet={setBet} balance={balance} gameState={gameState} />

              <div className="text-sm text-[#666666] text-center">
                Potential win: <span className="font-medium text-[#333333]">{potentialWin}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="bg-[#f1f5f9] p-2 rounded-xl shadow-sm">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell) => renderCell(cell))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">

          {(gameState === GAME_STATE.PLAYING) && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
              onClick={TakeLeaveFunction}
              disabled={money_for_reveal_cell == 0}
            >
              Take & Leave
            </Button>
          )}

          {gameState === GAME_STATE.READY && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
              onClick={startGame}
              disabled={bet > balance || bet <= 0}
            >
              Start Game
            </Button>
          )}
          {(gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST || gameState === GAME_STATE.TOOK_LEAVE) && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
              onClick={playAgain}
              disabled={bet > balance}
            >
              Play Again
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
