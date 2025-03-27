import { Badge } from "@/components/ui/badge";

// Function that builds the box of the data for a game
function GameBox({ name, wins, losses, colour, total_win }) {
  // Calculate win percentage safely
  const winPercentage = wins + losses > 0 
    ? Math.round((wins / (wins + losses)) * 100) 
    : 0;

  return (
    <div className="bg-white p-4 rounded-lg border border-[#e2e8f0]">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{name}</h4>
        <Badge className={`bg-${colour}-500`}>{wins + losses} Games</Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-xs text-[#64748b]">Wins</p>
          <p className="font-medium">{wins}</p>
        </div>
        <div>
          <p className="text-xs text-[#64748b]">Losses</p>
          <p className="font-medium">{losses}</p>
        </div>
        <div>
          <p className="text-xs text-[#64748b]">Win Rate</p>
          <p className="font-medium">
            {wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}%
          </p>
        </div>
        <div>
          <p className="text-xs text-[#64748b]">Total Win</p>
          <p className="font-medium">{total_win}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`bg-${colour}-500 h-2.5 rounded-full`}
          style={{ width: `${winPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Add all games here 
export default function GameStats({ stats }) {
  const games = [
    {
      name: "Blackjack",
      played: stats.blackjackGamesPlayed || 0,
      wins: stats.blackjackWins || 0,
      totalWin: stats.blackjackTotalWin || 0,
      colour: "blue",
    },
    {
      name: "Slots",
      played: stats.slotsPlayed || 0,
      wins: stats.slotsWins || 0,
      totalWin: stats.slotsTotalWin || 0,
      colour: "green",
    },
    {
      name: "Texas Hold'em",
      played: stats.texasHoldemPlayed || 0,
      wins: stats.texasHoldemWins || 0,
      totalWin: stats.texasHoldemTotalWin || 0,
      colour: "yellow",
    },
    {
      name: "Scratch Card",
      played: stats.scratchCardPlayed || 0,
      wins: stats.scratchCardWins || 0,
      totalWin: stats.scratchCardTotalWin || 0,
      colour: "purple",
    },
  ];

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <GameBox 
          key={game.name} // Add unique key prop
          name={game.name} 
          wins={game.wins} 
          losses={game.played - game.wins} // Fix losses calculation
          colour={game.colour} 
          total_win={game.totalWin} // Fix total_win reference
        />
      ))}
    </div>
  );
}