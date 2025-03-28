"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BettingInput from "../Utils/BettingInput";
import InGameHeader from "../Utils/InGameHeader";
import { Bomb, Diamond } from "lucide-react";
import { useUser } from './../../components/App';

// Game multipliers
const MULTIPLIERS = {
  LOW: { value: 1.5, rows: 5, cols: 5, bombs: 2 },
  MEDIUM: { value: 2, rows: 6, cols: 6, bombs: 3 },
  HIGH: { value: 3.5, rows: 7, cols: 7, bombs: 4 },
};

// Cell states
const CELL_STATE = {
  HIDDEN: "hidden",
  REVEALED: "revealed",
};

// Cell types
const CELL_TYPE = {
  SAFE: "safe",
  BOMB: "bomb",
};

// Game states
const GAME_STATE = {
  READY: "ready",
  PLAYING: "playing",
  WON: "won",
  LOST: "lost",
  TOOK_LEAVE: "took_leave",
};

export default function ScratchTheCardPage() {

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const { user, setUser } = useUser();

  const [multiplier, setMultiplier] = useState(MULTIPLIERS.LOW);
  const [grid, setGrid] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.READY);
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(100);
  const [moneyForReveal, setMoneyForReveal] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [safeCount, setSafeCount] = useState(0);
  const [message, setMessage] = useState("Reveal cells without hitting bombs");
  const [potentialWin, setPotentialWin] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Consolidated game stats
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    scratchCardTotalWin: 0,
  });

  const fetchUserData = async () => {
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
      setGameStats({
        gamesPlayed: data.stats?.scratchCardPlayed || 0,
        gamesWon: data.stats?.scratchCardWins || 0,
        scratchCardTotalWin: data.stats?.scratchCardTotalWin || 0,
      });
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setMessage("Failed to load user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBackend = async () => {
    try {
      // Update balance in the database
      await fetch(`${backendUrl}/api/users/${user.dbUser.id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance }),
      });

      // Update game stats in the database
      await fetch(`${backendUrl}/api/users/${user.dbUser.id}/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType: "scratchCard",
          played: gameStats.gamesPlayed,
          won: gameStats.gamesWon,
          totalWin: gameStats.scratchCardTotalWin,
        }),
      });

      // Refresh user data
      await fetchUserData();
    } catch (error) {
      console.error('Error updating backend:', error.message);
      setMessage("Failed to update game stats. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserData();
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST || gameState === GAME_STATE.TOOK_LEAVE) {
      updateBackend();
    }
  }, [gameState]);

  useEffect(() => {
    initializeGame();
  }, [multiplier]);

  useEffect(() => {
    setPotentialWin(Math.floor(bet * multiplier.value));
  }, [bet, multiplier]);

  const changeMultiplier = (newMultiplier) => {
    if (gameState === GAME_STATE.PLAYING) return;
    setMultiplier(newMultiplier);
  };

  const initializeGame = () => {
    const { rows, cols, bombs } = multiplier;
    const totalCells = rows * cols;
    const bombPositions = [];

    while (bombPositions.length < bombs) {
      const pos = Math.floor(Math.random() * totalCells);
      if (!bombPositions.includes(pos)) {
        bombPositions.push(pos);
      }
    }

    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const index = i * cols + j;
        let type = CELL_TYPE.SAFE;

        if (bombPositions.includes(index)) {
          type = CELL_TYPE.BOMB;
        }

        row.push({
          row: i,
          col: j,
          state: CELL_STATE.HIDDEN,
          type,
        });
      }
      newGrid.push(row);
    }

    setGrid(newGrid);
    setRevealedCount(0);
    setSafeCount(totalCells - bombs);
    setMoneyForReveal(0);
    setMessage("Reveal cells without hitting bombs");
  };

  const startGame = () => {
    if (bet > balance || bet <= 0) {
      setMessage("Invalid bet amount");
      return false;
    }

    setGameStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
    setBalance((prev) => prev - bet);
    setGameState(GAME_STATE.PLAYING);
    setMessage("Good luck!");
    return true;
  };

  const playAgain = () => {
    initializeGame();
    startGame();
  };

  const revealAllBombs = () => {
    const newGrid = [...grid];
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (newGrid[i][j].type === CELL_TYPE.BOMB) {
          newGrid[i][j].state = CELL_STATE.REVEALED;
        }
      }
    }
    setGrid(newGrid);
  };

  const revealCell = (row, col) => {
    if (gameState !== GAME_STATE.PLAYING) return;
    if (grid[row][col].state !== CELL_STATE.HIDDEN) return;

    const newGrid = [...grid];
    newGrid[row][col].state = CELL_STATE.REVEALED;
    setGrid(newGrid);

    const cell = newGrid[row][col];
    setRevealedCount((prev) => prev + 1);

    if (cell.type === CELL_TYPE.SAFE && revealedCount + 1 < safeCount) {
      const moneyForRevealCell = Math.floor(potentialWin / (multiplier.rows * multiplier.cols));
      setMoneyForReveal((prev) => {
        const newTotal = prev + moneyForRevealCell;
        setMessage(`You got ${moneyForRevealCell} for reveal. You already won ${newTotal}`);
        return newTotal;
      });
    }

    if (cell.type === CELL_TYPE.BOMB) {
      setGameState(GAME_STATE.LOST);
      setMoneyForReveal(0);
      setMessage("Boom! You lost all of the winnings!");
      revealAllBombs();
    }

    if (cell.type === CELL_TYPE.SAFE && revealedCount + 1 >= safeCount) {
      const winnings = Math.floor(bet * multiplier.value);
      setBalance((prev) => prev + winnings);
      setGameStats((prev) => ({
        ...prev,
        gamesWon: prev.gamesWon + 1,
        scratchCardTotalWin: prev.scratchCardTotalWin + winnings,
      }));
      setGameState(GAME_STATE.WON);
      setMessage(`You win ${winnings}!`);
    }
  };

  const renderCell = (cell) => {
    const { row, col, state, type } = cell;
    let content = null;
    let cellClass = "w-full h-full flex items-center justify-center rounded-lg transition-all";

    if (state === CELL_STATE.HIDDEN) {
      cellClass += " bg-white shadow-sm cursor-pointer hover:bg-blue-50";
    } else if (state === CELL_STATE.REVEALED) {
      if (type === CELL_TYPE.BOMB) {
        content = (
          <div className="text-red-500">
            <Bomb className="h-5 w-5" />
          </div>
        );
        cellClass += " bg-red-100 shadow-inner";
      } else {
        content = (
          <div className="text-blue-500">
            <Diamond className="h-5 w-5" />
          </div>
        );
        cellClass += " bg-blue-100 shadow-inner";
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
    );
  };

  const takeLeave = () => {
    setGameState(GAME_STATE.TOOK_LEAVE);
    setMessage(`You left with ${moneyForReveal}!`);
    setBalance((prev) => prev + moneyForReveal);
    setGameStats((prev) => ({
      ...prev,
      gamesWon: moneyForReveal > 0 ? prev.gamesWon + 1 : prev.gamesWon,
      scratchCardTotalWin: prev.scratchCardTotalWin + moneyForReveal,
    }));
    revealAllBombs();
    setMoneyForReveal(0);
  };

  const ScratchTheCardDescription = (
    <>
      <div>
        <h3 className="text-sm font-medium mb-2">Objective</h3>
        <p className="text-xs text-[#64748b]">
          Reveal safe cells in a grid to earn winnings while avoiding bombs. Cash out anytime with "Take & Leave" or aim for the full payout by revealing all safe cells.
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Rules</h3>
        <ul className="text-xs text-[#64748b] space-y-2">
          <li>Choose a multiplier: Low (1.5x, 5x5, 2 bombs), Medium (2x, 6x6, 3 bombs), or High (3.5x, 7x7, 4 bombs).</li>
          <li>Place a bet and start revealing cells one by one.</li>
          <li>Bombs end the game, losing your bet and winnings unless you cash out early.</li>
          <li>Safe cells incrementally increase your winnings; reveal all safe cells to win the full multiplier amount.</li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Payouts</h3>
        <ul className="text-xs text-[#64748b] space-y-2">
          <li>Each safe cell revealed: ~Bet × Multiplier / Total Cells (e.g., 1.5x on 5x5 = ~Bet/16.67 per cell).</li>
          <li>Full win (all safe cells): Bet × Multiplier (e.g., 100 bet at 1.5x = 150).</li>
          <li>Take & Leave: Keep accumulated winnings from revealed safe cells.</li>
          <li>Hit a bomb: Lose bet and all winnings if not cashed out.</li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Special Features</h3>
        <ul className="text-xs text-[#64748b] space-y-2">
          <li>Take & Leave: Cash out at any time with current winnings (resets to 0 after).</li>
          <li>Multiplier Selection: Higher multipliers increase grid size and bomb count, raising risk and reward.</li>
        </ul>
      </div>
    </>
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">
      <InGameHeader coins={balance} IsShowGuide={true} title={"Scratch Rules"} description={ScratchTheCardDescription} />

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

        {(gameState === GAME_STATE.READY || gameState === GAME_STATE.WON || gameState === GAME_STATE.LOST || gameState === GAME_STATE.TOOK_LEAVE) && (
          <div className="mb-6">
            <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
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
          {gameState === GAME_STATE.PLAYING && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 w-full max-w-xs py-6 rounded-xl text-white font-medium"
              onClick={takeLeave}
              disabled={moneyForReveal === 0}
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
              disabled={bet > balance || bet <= 0}
            >
              Play Again
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}