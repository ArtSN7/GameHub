import { Badge } from "@/components/ui/badge"

// function that builds the box of the data for a game
function GameBox({name, wins, losses, colour, total_win}) {
    // Calculate win percentage safely
    const winPercentage = wins + losses > 0 
        ? Math.round((wins / (wins + losses)) * 100) 
        : 0;

    return(
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
    )
}

// add all games here 
export default function GameStats() {
    return (
        <div>
            <GameBox name="Blackjack" wins={26} losses={16} colour="blue" total_win={1000} />
            <GameBox name="Roulette" wins={10} losses={5} colour="red" total_win={30} />
            <GameBox name="Slots" wins={10} losses={5} colour="yellow" total_win={580}/>
            <GameBox name="Plinko" wins={10} losses={5} colour="green" total_win={980}/>
            <GameBox name="Texas Hold'em" wins={10} losses={5} colour="purple" total_win={1300}/>
        </div>
    )
}