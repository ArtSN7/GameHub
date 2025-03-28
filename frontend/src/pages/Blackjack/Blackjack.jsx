"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import BettingInput from "../Utils/BettingInput";
import BlackJackBtns from "./BlackJackBtns";
import InGameHeader from "../Utils/InGameHeader";
import { useUser } from './../../components/App';

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
  const { user, setUser } = useUser();

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
  const [balance, setBalance] = useState(0);
  const [result, setResult] = useState(null);
  const [lastWin, setLastWin] = useState(0);
  const [insuranceBet, setInsuranceBet] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Consolidated game stats
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    blackjackTotalWin: 0,
  });

  // Track deck shuffles for debugging
  const [shuffleCount, setShuffleCount] = useState(0);

  const fetchUserData = async () => {
    if (!user.dbUser?.id) {
      console.error('No user ID available');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.dbUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setBalance(data.balance || 0);
      // Optionally initialize game stats from backend if needed
      setGameStats({
        gamesPlayed: data.stats?.blackjackGamesPlayed || 0,
        gamesWon: data.stats?.blackjackWins || 0,
        blackjackTotalWin: data.stats?.blackjackTotalWin || 0,
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
      await fetch(`/api/users/${user.dbUser.id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance }),
      });

      // Update game stats in the database
      await fetch(`/api/users/${user.dbUser.id}/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType: "blackjack",
          played: gameStats.gamesPlayed,
          won: gameStats.gamesWon,
          totalWin: gameStats.blackjackTotalWin,
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

  // Update backend only when game ends
  useEffect(() => {
    if (gameState === GAME_STATE.GAME_OVER) {
      updateBackend();
    }
  }, [gameState]);

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
    const shuffledDeck = shuffleDeck(newDeck);
    setShuffleCount((prev) => prev + 1);
    console.log(`Deck shuffled (${shuffleCount + 1} times). Total cards: ${shuffledDeck.length}`);
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

    setGameStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
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

    setDeck(localDeck);

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

    setDeck(localDeck);

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

    setDeck(localDeck);

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

    setDeck(localDeck);

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
    let localDeck = [...deck];

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
        console.log(`Dealer draws: ${card.value}${card.suit}`);
        localDeck = localDeck.slice(1);

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
        finalMessage.push(`${handLabel} loses to Dealer’s Blackjack.`);
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
    setGameStats((prev) => ({
      ...prev,
      gamesWon: netResult > 0 ? prev.gamesWon + 1 : prev.gamesWon,
      blackjackTotalWin: prev.blackjackTotalWin + netResult,
    }));

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

  const BlackJackDescription = (
    <>
      <div>
        <h3 className="text-sm font-medium mb-2">Objective</h3>
        <p className="text-xs text-[#64748b]">
          Beat the dealer by getting a hand value closer to 21 without going over. Cards 2-10 are worth their face value, J/Q/K are worth 10, and Aces are worth 1 or 11.
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Rules</h3>
        <ul className="text-xs text-[#64748b] space-y-2">
          <li>Game uses 6 decks, reshuffled when fewer than 26 cards remain.</li>
          <li>Dealer must hit on 16 or soft 17 (Ace + 6), and stand on hard 17 or higher.</li>
          <li>You start with 2 cards; dealer shows one card initially.</li>
          <li>Options: Hit (take another card), Stand (end turn), Double Down (double bet, take one card), Split (split pairs into two hands), Surrender (forfeit half bet).</li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Payouts</h3>
        <ul className="text-xs text-[#64748b] space-y-2">
          <li>Standard Win: 1:1 (bet returned + equal amount won).</li>
          <li>Blackjack (Ace + 10/J/Q/K): 3:2 (bet returned + 1.5x bet won).</li>
          <li>Push (tie with dealer): Bet returned, no win/loss.</li>
          <li>Insurance: 2:1 if dealer has Blackjack (offered when dealer shows Ace; costs half your bet).</li>
          <li>Surrender: Lose half your bet, end hand immediately.</li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Special Cases</h3>
        <ul className="text-xs text-[#64748b] space-y-2">
          <li>Split: Available when your first two cards are a pair; each new hand gets its own bet equal to the original.</li>
          <li>Double Down: Only on your first two cards if balance allows; doubles your bet and you get one more card.</li>
          <li>Bust: Going over 21 loses the hand automatically.</li>
        </ul>
      </div>
    </>
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333] flex flex-col">
      <InGameHeader coins={balance} IsShowGuide={true} title={"BlackJack Rules"} description={BlackJackDescription} />

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