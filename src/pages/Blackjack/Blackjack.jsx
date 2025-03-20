"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BettingInput from "../Utils/BettingInput";
import BlackJackBtns from "./BlackJackBtns";

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
    // Verify deck integrity
    const aceCounts = SUITS.map(suit => ({
      suit,
      count: newDeck.filter(card => card.value === "A" && card.suit === suit).length
    }));
    console.log("Ace counts in new deck:", aceCounts); // Should be 6 for each suit
    const shuffledDeck = shuffleDeck(newDeck);
    const shuffledAceCounts = SUITS.map(suit => ({
      suit,
      count: shuffledDeck.filter(card => card.value === "A" && card.suit === suit).length
    }));
    console.log("Ace counts after shuffle:", shuffledAceCounts); // Should still be 6 for each suit
    return shuffledDeck;
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
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

    setBalance((prev) => prev - bet);

    let localDeck = [...deck];
    if (localDeck.length < 26) {
      localDeck = createDeck();
      console.log("Deck reshuffled at start of game");
    }

    const playerCard1 = localDeck[0];
    const dealerCard1 = localDeck[1];
    const playerCard2 = localDeck[2];
    const dealerCard2 = localDeck[3];
    localDeck = localDeck.slice(4);

    const newPlayerHand = [playerCard1, playerCard2];
    const newDealerHand = [dealerCard1, dealerCard2];

    setPlayerHands([newPlayerHand]);
    setActiveHandIndex(0);
    setDealerHand(newDealerHand);
    setHandBets([bet]);
    setInsuranceBet(0);

    const newPlayerScore = calculateScore(newPlayerHand);
    const newDealerScore = calculateScore([dealerCard1]);

    setPlayerScores([newPlayerScore]);
    setDealerScore(newDealerScore);

    setLastWin(0);
    setResult(null);

    setDeck(localDeck); // Update deck state at the end

    const playerHasBlackjack = newPlayerScore === 21 && newPlayerHand.length === 2;

    if (dealerCard1.value === "A") {
      setGameState(GAME_STATE.INSURANCE);
      setMessage("Dealer shows an Ace. Would you like insurance?");
    } else if (playerHasBlackjack) {
      setGameState(GAME_STATE.GAME_OVER);
      determineWinner([newPlayerHand], newDealerHand);
    } else {
      setGameState(GAME_STATE.PLAYER_TURN);
      setMessage("Your turn: Hit, Stand, Double, Split, or Surrender");
    }
  };

  const handleInsurance = (takeInsurance) => {
    if (takeInsurance) {
      const insuranceAmount = Math.floor(bet / 2);
      if (insuranceAmount > balance) {
        setMessage("Not enough chips for insurance. Continuing without it.");
      } else {
        setInsuranceBet(insuranceAmount);
        setBalance((prev) => prev - insuranceAmount);
      }
    }

    const playerHasBlackjack = calculateScore(playerHands[0]) === 21 && playerHands[0].length === 2;
    if (playerHasBlackjack) {
      setGameState(GAME_STATE.GAME_OVER);
      determineWinner(playerHands, dealerHand);
    } else {
      setGameState(GAME_STATE.PLAYER_TURN);
      setMessage("Your turn: Hit, Stand, Double, Split, or Surrender");
    }
  };

  const hit = () => {
    if (gameState !== GAME_STATE.PLAYER_TURN || !playerHands[activeHandIndex]) return;

    let localDeck = [...deck];
    if (localDeck.length < 26) {
      localDeck = createDeck();
      console.log("Deck reshuffled during hit");
    }

    const card = localDeck[0];
    localDeck = localDeck.slice(1);

    const newHands = [...playerHands];
    newHands[activeHandIndex] = [...newHands[activeHandIndex], card];
    setPlayerHands(newHands);

    const newScore = calculateScore(newHands[activeHandIndex]);
    const newScores = [...playerScores];
    newScores[activeHandIndex] = newScore;
    setPlayerScores(newScores);

    setDeck(localDeck); // Update deck state at the end

    if (newScore > 21) {
      if (activeHandIndex < newHands.length - 1) {
        setActiveHandIndex(activeHandIndex + 1);
        setMessage(`Hand ${activeHandIndex + 1} busted. Now playing Hand ${activeHandIndex + 2}.`);
      } else {
        setGameState(GAME_STATE.DEALER_TURN);
        setMessage("All player hands completed. Dealer’s turn.");
        dealerTurn(newHands, dealerHand);
      }
    } else {
      setMessage(`Playing Hand ${activeHandIndex + 1}: Hit, Stand, Double, Split, or Surrender`);
    }
  };

  const stand = () => {
    if (gameState !== GAME_STATE.PLAYER_TURN || !playerHands[activeHandIndex]) return;

    if (activeHandIndex < playerHands.length - 1) {
      setActiveHandIndex(activeHandIndex + 1);
      setMessage(`Standing on Hand ${activeHandIndex + 1}. Playing Hand ${activeHandIndex + 2} now.`);
    } else {
      setGameState(GAME_STATE.DEALER_TURN);
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
    setBalance((prev) => prev - doubleAmount);
    const newHandBets = [...handBets];
    newHandBets[activeHandIndex] *= 2;
    setHandBets(newHandBets);

    let localDeck = [...deck];
    if (localDeck.length < 26) {
      localDeck = createDeck();
      console.log("Deck reshuffled during double down");
    }

    const card = localDeck[0];
    localDeck = localDeck.slice(1);

    const newHands = [...playerHands];
    newHands[activeHandIndex] = [...newHands[activeHandIndex], card];
    setPlayerHands(newHands);

    const newScore = calculateScore(newHands[activeHandIndex]);
    const newScores = [...playerScores];
    newScores[activeHandIndex] = newScore;
    setPlayerScores(newScores);

    setDeck(localDeck); // Update deck state at the end

    if (activeHandIndex < newHands.length - 1) {
      setActiveHandIndex(activeHandIndex + 1);
      setMessage(`Doubled down on Hand ${activeHandIndex + 1}. Playing Hand ${activeHandIndex + 2} now.`);
    } else {
      setGameState(GAME_STATE.DEALER_TURN);
      setMessage("All hands complete. Dealer’s turn.");
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
    ) {
      setMessage("Cannot split: Invalid hand or insufficient balance.");
      return;
    }

    setBalance((prev) => prev - handBets[activeHandIndex]);

    let localDeck = [...deck];
    if (localDeck.length < 26) {
      localDeck = createDeck();
      console.log("Deck reshuffled during split");
    }

    const card1 = localDeck[0];
    const card2 = localDeck[1];
    localDeck = localDeck.slice(2);

    const newHands = [...playerHands];
    const currentHand = newHands[activeHandIndex];
    newHands[activeHandIndex] = [currentHand[0], card1];
    newHands.push([currentHand[1], card2]);
    setPlayerHands(newHands);

    const newHandBets = [...handBets, handBets[activeHandIndex]];
    setHandBets(newHandBets);

    const newScores = newHands.map((hand) => calculateScore(hand));
    setPlayerScores(newScores);

    setDeck(localDeck); // Update deck state at the end

    setMessage(`Split into ${newHands.length} hands. Playing Hand ${activeHandIndex + 1} now.`);
  };

  const surrender = () => {
    if (
      gameState !== GAME_STATE.PLAYER_TURN ||
      !playerHands[activeHandIndex] ||
      playerHands[activeHandIndex].length !== 2
    ) return;
    setGameState(GAME_STATE.GAME_OVER);
    const refund = Math.floor(handBets[activeHandIndex] / 2);
    setBalance((prev) => prev + refund);
    setMessage(
      playerHands.length > 1
        ? `Surrendered Hand ${activeHandIndex + 1}. Refunded ${refund} chips.`
        : `You surrendered. Refunded ${refund} chips.`
    );
    setResult("lose");
    setLastWin(0);
  };

  const dealerTurn = (pHands, dHand) => {
    setGameState(GAME_STATE.DEALER_TURN);
    setMessage("Dealer is playing...");
    let currentDealerHand = [...dHand];
    let currentDealerScore = calculateScore(currentDealerHand);
    let localDeck = [...deck]; // Use a local copy of the deck to avoid state update issues

    const dealerPlay = () => {
      if (currentDealerScore < 17 || (currentDealerScore === 17 && isSoftSeventeen(currentDealerHand))) {
        if (localDeck.length < 26) {
          localDeck = createDeck();
          console.log("Deck reshuffled during dealer turn");
        }

        if (localDeck.length === 0) {
          console.error("Deck is empty! Forcing a reshuffle.");
          localDeck = createDeck();
        }

        const card = localDeck[0];
        console.log(`Dealer draws: ${card.value}${card.suit}`); // Debug log
        localDeck = localDeck.slice(1); // Update local deck

        currentDealerHand = [...currentDealerHand, card];
        currentDealerScore = calculateScore(currentDealerHand);

        setDealerHand(currentDealerHand);
        setDealerScore(currentDealerScore);

        setTimeout(dealerPlay, 600);
      } else {
        setDeck(localDeck);
        setDealerHand(currentDealerHand);
        setDealerScore(currentDealerScore);
        determineWinner(pHands, currentDealerHand);
      }
    };

    setTimeout(dealerPlay, 600);
  };

  const determineWinner = (pHands, dHand) => {
    setGameState(GAME_STATE.GAME_OVER);
    const dScore = calculateScore(dHand);
    let totalWin = 0;
    let totalLoss = 0;
    let finalMessage = [];

    if (insuranceBet > 0) {
      if (dScore === 21 && dHand.length === 2) {
        totalWin += insuranceBet * 2;
        finalMessage.push(`Insurance paid out ${insuranceBet * 2} chips.`);
      } else {
        totalLoss += insuranceBet;
        finalMessage.push(`Insurance lost (${insuranceBet} chips).`);
      }
    }

    pHands.forEach((hand, index) => {
      const pScore = calculateScore(hand);
      const isBlackjack = pScore === 21 && hand.length === 2;
      const dealerBlackjack = dScore === 21 && dHand.length === 2;
      const handLabel = pHands.length > 1 ? `Hand ${index + 1}` : "You";
      const betAmount = handBets[index];

      if (pScore > 21) {
        finalMessage.push(`${handLabel} busted.`);
        totalLoss += betAmount;
      } else if (dScore > 21) {
        finalMessage.push(`${handLabel} wins! Dealer busted.`);
        totalWin += betAmount * 2;
      } else if (isBlackjack && !dealerBlackjack) {
        const blackjackPayout = Math.floor(betAmount * 2.5);
        finalMessage.push(`${handLabel} wins with Blackjack!`);
        totalWin += blackjackPayout;
      } else if (!isBlackjack && dealerBlackjack) {
        finalMessage.push(`${handLabel} loses to Dealer’s Blackjack .`);
        totalLoss += betAmount;
      } else if (pScore > dScore) {
        finalMessage.push(`${handLabel} wins!`);
        totalWin += betAmount * 2;
      } else if (pScore < dScore) {
        finalMessage.push(`${handLabel} loses.`);
        totalLoss += betAmount;
      } else {
        finalMessage.push(`${handLabel} pushes.`);
        totalWin += betAmount;
      }
    });

    const netResult = totalWin - totalLoss;
    setBalance((prev) => prev + netResult);
    setMessage(finalMessage.join(" "));
    setLastWin(netResult);
    setResult(netResult > 0 ? "win" : netResult < 0 ? "lose" : "push");
    setDealerScore(dScore);
  };

  const isBetValid = () => bet >= 10 && bet <= balance;

  const getCardDisplay = (card, isHidden = false) => {
    if (!card) return null;
    if (isHidden) {
      return (
        <div className="w-full h-full bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
          <div className="text-white font-bold text-2xl md:text-3xl">?</div>
        </div>
      );
    }
    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
      <div
        className={`w-full h-full bg-white rounded-xl flex flex-col justify-between p-2 md:p-3 shadow-md ${
          isRed ? "text-red-500" : "text-black"
        }`}
      >
        <div className="text-left text-sm md:text-base font-medium">{card.value}</div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl md:text-3xl">{card.suit}</div>
        </div>
        <div className="text-right text-sm md:text-base font-medium rotate-180">{card.value}</div>
      </div>
    );
  };

  const getMessageColor = () => {
    if (result === "win") return "bg-green-100 text-green-700";
    if (result === "lose") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333] flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center text-[#666666] hover:text-blue-500 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Badge className="bg-blue-500 hover:bg-blue-600 py-1 px-3 md:py-1.5 md:px-4 rounded-full text-sm">
              {balance}
            </Badge>
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

      <main className="flex-grow container px-4 py-6 md:py-8 mx-auto w-full">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">Blackjack</h1>
        </div>

        <div className="space-y-8 md:space-y-12">
          <div>
            {dealerScore > 0 && gameState !== GAME_STATE.PLAYER_TURN && gameState !== GAME_STATE.INSURANCE && (
              <div className="text-center mb-2">
                <span className="text-sm md:text-base font-medium text-[#666666]">
                  Score: {dealerScore}
                </span>
              </div>
            )}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <AnimatePresence>
                  {dealerHand.map((card, index) => (
                    <motion.div
                      key={`dealer-${index}`}
                      initial={{ opacity: 0, y: -20, rotateY: 180 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="w-16 h-24 md:w-20 md:h-28 shadow-md rounded-xl overflow-hidden"
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
                className={`py-2 px-4 md:px-6 rounded-full text-center text-sm md:text-base font-medium ${getMessageColor()} max-w-full break-words`}
              >
                {message}
                {lastWin !== 0 && (
                  <span className="ml-2 font-semibold">{lastWin > 0 ? `+${lastWin}` : lastWin}</span>
                )}
              </motion.div>
            </div>
          )}

          <div>
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="flex flex-col gap-6 md:gap-8 w-full">
                {playerHands.map((hand, handIndex) => (
                  <div key={handIndex} className="flex flex-col items-center p-3 md:p-4">
                    <div
                      className={`inline-flex flex-col items-center ${
                        handIndex === activeHandIndex && gameState === GAME_STATE.PLAYER_TURN
                          ? "border-2 border-blue-100 rounded-lg p-3"
                          : ""
                      }`}
                    >
                      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <AnimatePresence>
                          {hand.map((card, index) => (
                            <motion.div
                              key={`player-${handIndex}-${index}`}
                              initial={{ opacity: 0, y: 20, rotateY: 180 }}
                              animate={{ opacity: 1, y: 0, rotateY: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="w-16 h-24 md:w-20 md:h-28 shadow-md rounded-xl overflow-hidden"
                            >
                              {getCardDisplay(card)}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      {playerScores[handIndex] > 0 && (
                        <span className="mt-2 text-sm md:text-base font-medium text-[#666666]">
                          Score: {playerScores[handIndex]} (Bet: {handBets[handIndex]})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 md:gap-6">
              {(gameState === GAME_STATE.BETTING || gameState === GAME_STATE.GAME_OVER) && (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <BettingInput bet={bet} setBet={setBet} balance={balance} gameState={gameState} />
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 w-32 py-2 md:py-3 rounded-lg text-white font-medium text-sm md:text-base"
                    onClick={startGame}
                    disabled={!isBetValid()}
                  >
                    Deal Cards
                  </Button>
                </div>
              )}

              {gameState === GAME_STATE.INSURANCE && (
                <div className="flex gap-3 justify-center w-full max-w-sm">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 flex-1 py-4 md:py-6 rounded-xl text-white font-medium text-sm md:text-base"
                    onClick={() => handleInsurance(true)}
                  >
                    Insurance
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 flex-1 py-4 md:py-6 rounded-xl text-white font-medium text-sm md:text-base"
                    onClick={() => handleInsurance(false)}
                  >
                    No Insurance
                  </Button>
                </div>
              )}

              {gameState === GAME_STATE.PLAYER_TURN && playerHands[activeHandIndex]?.length > 0 && (
                <BlackJackBtns
                  hit={hit}
                  stand={stand}
                  doubleDown={doubleDown}
                  split={split}
                  surrender={surrender}
                  playerHands={playerHands}
                  activeHandIndex={activeHandIndex}
                  balance={balance}
                  handBets={handBets}
                  className="w-full max-w-sm"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}