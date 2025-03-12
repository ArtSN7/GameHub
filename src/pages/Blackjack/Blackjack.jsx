"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUIT_COLORS = {
  "♠": "text-black",
  "♥": "text-red-500",
  "♦": "text-red-500",
  "♣": "text-black",
};

const GAME_STATE = {
  BETTING: "betting",
  INSURANCE: "insurance",
  PLAYER_TURN: "playerTurn",
  DEALER_TURN: "dealerTurn",
  GAME_OVER: "gameOver",
};

export default function BlackjackPage() {
  const [deck, setDeck] = useState([]);
  const [playerHands, setPlayerHands] = useState([[]]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScores, setPlayerScores] = useState([0]);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameState, setGameState] = useState(GAME_STATE.BETTING);
  const [message, setMessage] = useState("Place your bet to start the game");
  const [bet, setBet] = useState(100);
  const [handBets, setHandBets] = useState([100]);
  const [balance, setBalance] = useState(1000);
  const [result, setResult] = useState(null);
  const [lastWin, setLastWin] = useState(0);
  const [insuranceBet, setInsuranceBet] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const createDeck = () => {
    const newDeck = [];
    const numberOfDecks = 6;
    for (let deckNum = 0; deckNum < numberOfDecks; deckNum++) {
      for (const suit of SUITS) {
        for (const value of VALUES) {
          newDeck.push({ suit, value });
        }
      }
    }
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    const array = new Uint32Array(shuffled.length);
    crypto.getRandomValues(array);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = array[i] % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    console.log("Deck shuffled (first 5 cards):", shuffled.slice(0, 5));
    return shuffled;
  };

  const initializeGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setPlayerHands([[]]);
    setActiveHandIndex(0);
    setDealerHand([]);
    setPlayerScores([0]);
    setDealerScore(0);
    setGameState(GAME_STATE.BETTING);
    setMessage("Place your bet to start the game");
    setResult(null);
    setLastWin(0);
    setHandBets([bet]);
    setInsuranceBet(0);
  };

  const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
      if (card.value === "A") {
        aces++;
        score += 11;
      } else if (["J", "Q", "K"].includes(card.value)) {
        score += 10;
      } else {
        score += Number.parseInt(card.value);
      }
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  };

  const isSoftSeventeen = (hand) => {
    const score = calculateScore(hand);
    return score === 17 && hand.some((card) => card.value === "A");
  };

  const startGame = () => {
    if (bet < 10 || bet > balance) {
      setMessage("Bet must be between 10 and your current balance");
      return;
    }

    setBalance(balance - bet);

    let freshDeck = createDeck();
    const playerCard1 = freshDeck[0];
    freshDeck = freshDeck.slice(1);
    const dealerCard1 = freshDeck[0];
    freshDeck = freshDeck.slice(1);
    const playerCard2 = freshDeck[0];
    freshDeck = freshDeck.slice(1);
    const dealerCard2 = freshDeck[0];
    freshDeck = freshDeck.slice(1);

    setDeck(freshDeck);

    console.log("Dealt cards - Player:", [playerCard1, playerCard2], "Dealer:", [dealerCard1, dealerCard2]);

    const newPlayerHand = [playerCard1, playerCard2];
    const newDealerHand = [dealerCard1, dealerCard2];

    setPlayerHands([newPlayerHand]);
    setDealerHand(newDealerHand);
    setHandBets([bet]);

    const newPlayerScore = calculateScore(newPlayerHand);
    const newDealerScore = calculateScore([dealerCard1]);

    setPlayerScores([newPlayerScore]);
    setDealerScore(newDealerScore);

    if (dealerCard1.value === "A") {
      setGameState(GAME_STATE.INSURANCE);
      setMessage("Dealer shows an Ace. Would you like insurance?");
    } else {
      setGameState(GAME_STATE.PLAYER_TURN);
      setMessage("Your turn: Hit, Stand, Double, Split, or Surrender");
      if (newPlayerScore === 21) {
        dealerTurn([newPlayerHand], newDealerHand);
      }
    }
  };

  const handleInsurance = (takeInsurance) => {
    if (takeInsurance) {
      const insuranceAmount = Math.floor(bet / 2);
      if (insuranceAmount > balance) {
        setMessage("Not enough chips for insurance. Continuing without it.");
        setGameState(GAME_STATE.PLAYER_TURN);
        return;
      }
      setInsuranceBet(insuranceAmount);
      setBalance(balance - insuranceAmount);
    }
    setGameState(GAME_STATE.PLAYER_TURN);
    setMessage("Your turn: Hit, Stand, Double, Split, or Surrender");
    if (calculateScore(playerHands[0]) === 21) {
      dealerTurn(playerHands, dealerHand);
    }
  };

  const hit = () => {
    if (gameState !== GAME_STATE.PLAYER_TURN || !playerHands[activeHandIndex]) return;

    let currentDeck = deck;
    if (!currentDeck || currentDeck.length < 52) {
      currentDeck = createDeck();
    }
    const card = currentDeck[0];
    currentDeck = currentDeck.slice(1);
    setDeck(currentDeck);

    console.log("Dealt card in hit:", card);

    const newHands = [...playerHands];
    newHands[activeHandIndex] = [...newHands[activeHandIndex], card];
    setPlayerHands(newHands);

    const newScore = calculateScore(newHands[activeHandIndex]);
    const newScores = [...playerScores];
    newScores[activeHandIndex] = newScore;
    setPlayerScores(newScores);

    if (newScore > 21) {
      if (activeHandIndex < newHands.length - 1) {
        setActiveHandIndex(activeHandIndex + 1);
        setMessage(`Hand ${activeHandIndex + 1} busted. Playing Hand ${activeHandIndex + 2} now.`);
      } else {
        setGameState(GAME_STATE.GAME_OVER);
        setMessage(newHands.length > 1 ? "You busted on all hands! Game over." : "You busted! Game over.");
        setResult("lose");
        setLastWin(0);
      }
    }
  };

  const stand = () => {
    if (gameState !== GAME_STATE.PLAYER_TURN || !playerHands[activeHandIndex]) return;
    if (activeHandIndex < playerHands.length - 1) {
      setActiveHandIndex(activeHandIndex + 1);
      setMessage(`Standing on Hand ${activeHandIndex + 1}. Playing Hand ${activeHandIndex + 2} now.`);
    } else {
      setMessage("All hands complete. Dealer’s turn.");
      dealerTurn(playerHands, dealerHand);
    }
  };

  const doubleDown = () => {
    if (
      gameState !== GAME_STATE.PLAYER_TURN ||
      !playerHands[activeHandIndex] ||
      playerHands[activeHandIndex].length !== 2 ||
      balance < handBets[activeHandIndex]
    ) return;

    const doubleAmount = handBets[activeHandIndex];
    if (balance < doubleAmount) {
      setMessage("Not enough chips to double down.");
      return;
    }

    setBalance(balance - doubleAmount);
    const newHandBets = [...handBets];
    newHandBets[activeHandIndex] *= 2;
    setHandBets(newHandBets);

    let currentDeck = deck;
    if (!currentDeck || currentDeck.length < 52) {
      currentDeck = createDeck();
    }
    const card = currentDeck[0];
    currentDeck = currentDeck.slice(1);
    setDeck(currentDeck);

    console.log("Dealt card in double Down:", card);

    const newHands = [...playerHands];
    newHands[activeHandIndex] = [...newHands[activeHandIndex], card];
    setPlayerHands(newHands);

    const newScore = calculateScore(newHands[activeHandIndex]);
    const newScores = [...playerScores];
    newScores[activeHandIndex] = newScore;
    setPlayerScores(newScores);

    if (newScore > 21) {
      setGameState(GAME_STATE.GAME_OVER);
      setMessage(
        newHands.length > 1
          ? `You busted on Hand ${activeHandIndex + 1} after Double Down! Game over.`
          : "You busted on Double Down! Game over."
      );
      setResult("lose");
      setLastWin(0);
    } else {
      setMessage(
        newHands.length > 1
          ? `Doubled down on Hand ${activeHandIndex + 1}. Dealer’s turn.`
          : "You doubled down. Dealer’s turn."
      );
      dealerTurn(newHands, dealerHand);
    }
  };

  const split = () => {
    if (
      gameState !== GAME_STATE.PLAYER_TURN ||
      !playerHands[activeHandIndex] ||
      playerHands[activeHandIndex].length !== 2 ||
      playerHands[activeHandIndex][0].value !== playerHands[activeHandIndex][1].value ||
      balance < handBets[activeHandIndex]
    ) return;

    setBalance(balance - handBets[activeHandIndex]);
    let currentDeck = deck;
    if (!currentDeck || currentDeck.length < 52) {
      currentDeck = createDeck();
    }
    const card1 = currentDeck[0];
    currentDeck = currentDeck.slice(1);
    const card2 = currentDeck[0];
    currentDeck = currentDeck.slice(1);
    setDeck(currentDeck);

    console.log("Dealt cards in split:", card1, card2);

    const newHands = [...playerHands];
    const currentHand = newHands[activeHandIndex];
    newHands[activeHandIndex] = [currentHand[0], card1];
    newHands.push([currentHand[1], card2]);
    setPlayerHands(newHands);

    const newHandBets = [...handBets, handBets[activeHandIndex]];
    setHandBets(newHandBets);

    const newScores = newHands.map((hand) => calculateScore(hand));
    setPlayerScores(newScores);
    setMessage(`Split into two hands. Playing Hand ${activeHandIndex + 1} now.`);
  };

  const surrender = () => {
    if (
      gameState !== GAME_STATE.PLAYER_TURN ||
      !playerHands[activeHandIndex] ||
      playerHands[activeHandIndex].length !== 2
    ) return;
    setGameState(GAME_STATE.GAME_OVER);
    setMessage(
      playerHands.length > 1
        ? `Surrendered Hand ${activeHandIndex + 1}. You get half your bet back (${Math.floor(handBets[activeHandIndex] / 2)} chips).`
        : `You surrendered. You get half your bet back (${Math.floor(handBets[activeHandIndex] / 2)} chips).`
    );
    setBalance(balance + Math.floor(handBets[activeHandIndex] / 2));
    setResult("lose");
    setLastWin(0);
  };

  const dealerTurn = (pHands, dHand) => {
    setGameState(GAME_STATE.DEALER_TURN);
    setMessage("Dealer is playing...");
    let currentDealerHand = [...dHand];
    let currentDealerScore = calculateScore(currentDealerHand);
    setDealerScore(currentDealerScore);

    const dealerPlay = () => {
      if (currentDealerScore < 17 || (currentDealerScore === 17 && isSoftSeventeen(currentDealerHand))) {
        let currentDeck = deck;
        if (!currentDeck || currentDeck.length < 52) {
          currentDeck = createDeck();
        }
        const card = currentDeck[0];
        currentDeck = currentDeck.slice(1);
        setDeck(currentDeck);

        console.log("Dealt card in dealerTurn:", card);

        currentDealerHand = [...currentDealerHand, card];
        currentDealerScore = calculateScore(currentDealerHand);
        setDealerHand(currentDealerHand);
        setDealerScore(currentDealerScore);
        setTimeout(dealerPlay, 600);
      } else {
        determineWinner(pHands, currentDealerHand);
      }
    };

    setTimeout(dealerPlay, 600);
  };

  const determineWinner = (pHands, dHand) => {
    setGameState(GAME_STATE.GAME_OVER);
    const dScore = calculateScore(dHand);
    let totalWin = 0;
    let finalMessage = "";

    if (insuranceBet > 0 && dScore === 21 && dHand.length === 2) {
      totalWin += insuranceBet * 2;
      setBalance((prev) => prev + insuranceBet * 2);
      finalMessage += `Insurance paid out ${insuranceBet * 2} chips. `;
    }

    pHands.forEach((hand, index) => {
      const pScore = calculateScore(hand);
      const isBlackjack = pScore === 21 && hand.length === 2;
      const dealerBlackjack = dScore === 21 && dHand.length === 2;
      const handLabel = pHands.length > 1 ? `Hand ${index + 1}` : "You";

      if (pScore > 21) {
        finalMessage += `${handLabel} busted (Score: ${pScore}). `;
      } else if (dScore > 21) {
        finalMessage += `${handLabel} wins! Dealer busted (Score: ${dScore}). `;
        totalWin += handBets[index] * 2;
      } else if (isBlackjack && !dealerBlackjack) {
        finalMessage += `${handLabel} wins with Blackjack! `;
        totalWin += Math.floor(handBets[index] * 2.5);
      } else if (!isBlackjack && dealerBlackjack) {
        finalMessage += `${handLabel} loses to Dealer’s Blackjack. `;
      } else if (pScore > dScore) {
        finalMessage += `${handLabel} wins (${pScore} vs ${dScore})! `;
        totalWin += handBets[index] * 2;
      } else if (pScore < dScore) {
        finalMessage += `${handLabel} loses (${pScore} vs ${dScore}). `;
      } else {
        finalMessage += `${handLabel} pushes (${pScore} vs ${dScore}). +${handBets[index]} chips `;
        totalWin += handBets[index];
      }
    });

    setBalance((prev) => prev + totalWin);
    setMessage(finalMessage.trim());
    setLastWin(totalWin);
    setResult(totalWin > 0 ? "win" : "lose");
  };

  const increaseBet = () => {
    if (gameState !== GAME_STATE.BETTING && gameState !== GAME_STATE.GAME_OVER) return;
    setBet(Math.min(bet + 100, balance));
    setHandBets([Math.min(bet + 100, balance)]);
  };

  const decreaseBet = () => {
    if (gameState !== GAME_STATE.BETTING && gameState !== GAME_STATE.GAME_OVER) return;
    setBet(Math.max(bet - 100, 0));
    setHandBets([Math.max(bet - 100, 0)]);
  };

  const handleBetInput = (e) => {
    if (gameState !== GAME_STATE.BETTING && gameState !== GAME_STATE.GAME_OVER) return;
    const value = Number(e.target.value);
    setBet(isNaN(value) ? 0 : value);
    setHandBets([isNaN(value) ? 0 : value]);
  };

  const isBetValid = () => {
    return bet >= 10 && bet <= balance;
  };

  const getCardDisplay = (card, isHidden = false) => {
    if (!card) return null;
    if (isHidden) {
      return (
        <div className="w-full h-full bg-blue-500 rounded-2xl flex items-center justify-center shadow-md">
          <div className="text-white font-bold text-xl">?</div>
        </div>
      );
    }
    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
      <div
        className={`w-full h-full bg-white rounded-2xl flex flex-col justify-between p-3 shadow-md ${
          isRed ? "text-red-500" : "text-black"
        }`}
      >
        <div className="text-left text-sm font-medium">{card.value}</div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-2xl">{card.suit}</div>
        </div>
        <div className="text-right text-sm font-medium rotate-180">{card.value}</div>
      </div>
    );
  };

  const getMessageColor = () => {
    if (message.includes("wins") || message.includes("Blackjack")) {
      return "bg-green-100 text-green-700";
    } else if (
      message.includes("busted") ||
      message.includes("loses") ||
      message.includes("Surrendered") ||
      message.includes("Game over")
    ) {
      return "bg-red-100 text-red-700";
    } else {
      return "bg-blue-100 text-blue-700";
    }
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

      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#333333]">Blackjack</h1>
        </div>

        <div className="space-y-12">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#666666]">Dealer’s Hand</h2>
            </div>
            {dealerScore > 0 && gameState !== GAME_STATE.PLAYER_TURN && gameState !== GAME_STATE.INSURANCE && (
              <div className="text-center mb-2">
                <span className="text-base font-medium text-[#666666]">Score: {dealerScore}</span>
              </div>
            )}
            <div className="flex justify-center">
              <div className="flex gap-6">
                <AnimatePresence>
                  {dealerHand.map((card, index) => (
                    <motion.div
                      key={`dealer-${index}`}
                      initial={{ opacity: 0, y: -20, rotateY: 180 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="w-20 h-28 shadow-md rounded-2xl overflow-hidden"
                    >
                      {index === 1 && (gameState === GAME_STATE.PLAYER_TURN || gameState === GAME_STATE.INSURANCE)
                        ? getCardDisplay(card, true)
                        : getCardDisplay(card)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {message && (
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`py-2 px-6 rounded-full text-center text-base font-medium ${getMessageColor()}`}
              >
                {message}
                {lastWin > 0 && result && result !== "lose" && (
                  <span className="ml-2 font-semibold">+{lastWin} chips</span>
                )}
              </motion.div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#666666]">Your Hands</h2>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex flex-col gap-8 w-full max-w-3xl">
                {playerHands.map((hand, handIndex) => (
                  <div key={handIndex} className="flex flex-col items-center p-4">
                    <div className="flex gap-6">
                      <AnimatePresence>
                        {hand.map((card, index) => (
                          <motion.div
                            key={`player-${handIndex}-${index}`}
                            initial={{ opacity: 0, y: 20, rotateY: 180 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="w-20 h-28 shadow-md rounded-2xl overflow-hidden"
                          >
                            {getCardDisplay(card)}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    {playerScores[handIndex] > 0 && (
                      <span className="mt-2 text-base font-medium text-[#666666]">
                        Score: {playerScores[handIndex]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              {(gameState === GAME_STATE.BETTING || gameState === GAME_STATE.GAME_OVER) && (
                <div className="flex flex-col items-center gap-4 w-full max-w-xs">
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
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 w-full py-6 rounded-xl text-white font-medium"
                    onClick={startGame}
                    disabled={!isBetValid()}
                  >
                    Deal Cards
                  </Button>
                </div>
              )}

              {gameState === GAME_STATE.INSURANCE && (
                <div className="flex gap-3 justify-center w-full max-w-xs">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium"
                    onClick={() => handleInsurance(true)}
                  >
                    Take Insurance
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium"
                    onClick={() => handleInsurance(false)}
                  >
                    No Insurance
                  </Button>
                </div>
              )}

              {gameState === GAME_STATE.PLAYER_TURN && playerHands[activeHandIndex] && (
                <div className="flex flex-wrap gap-3 justify-center w-full max-w-md">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px]"
                    onClick={hit}
                  >
                    Hit
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px]"
                    onClick={stand}
                  >
                    Stand
                  </Button>
                  <Button
                    className={`bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px] ${
                      playerHands[activeHandIndex].length !== 2 || balance < handBets[activeHandIndex]
                        ? "opacity-50"
                        : ""
                    }`}
                    onClick={doubleDown}
                    disabled={playerHands[activeHandIndex].length !== 2 || balance < handBets[activeHandIndex]}
                  >
                    2x Down
                  </Button>
                  <Button
                    className={`bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px] ${
                      playerHands[activeHandIndex].length !== 2 ||
                      playerHands[activeHandIndex][0].value !== playerHands[activeHandIndex][1].value ||
                      balance < handBets[activeHandIndex]
                        ? "opacity-50"
                        : ""
                    }`}
                    onClick={split}
                    disabled={
                      playerHands[activeHandIndex].length !== 2 ||
                      playerHands[activeHandIndex][0].value !== playerHands[activeHandIndex][1].value ||
                      balance < handBets[activeHandIndex]
                    }
                  >
                    Split
                  </Button>
                  <Button
                    className={`bg-blue-500 hover:bg-blue-600 flex-1 py-6 rounded-xl text-white font-medium min-w-[80px] ${
                      playerHands[activeHandIndex].length !== 2 ? "opacity-50" : ""
                    }`}
                    onClick={surrender}
                    disabled={playerHands[activeHandIndex].length !== 2}
                  >
                    Surrender
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}