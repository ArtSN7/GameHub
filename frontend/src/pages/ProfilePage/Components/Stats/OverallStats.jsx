import { Card, CardContent } from "@/components/ui/card"

export default function OverallStats({total_wins, total_games}) {

  const winPercentage = total_games > 0 
  ? Math.round((total_wins / total_games) * 100) 
  : 0;

  return (
        <div>
        <h3 className="text-lg font-medium mb-3">Overall Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <h3 className="text-sm font-medium text-[#64748b] mb-1">Total Wins</h3>
              <p className="text-2xl font-bold">{total_wins}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <h3 className="text-sm font-medium text-[#64748b] mb-1">Total Games</h3>
              <p className="text-2xl font-bold">{total_games}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <h3 className="text-sm font-medium text-[#64748b] mb-1">Win Rate</h3>
              <p className="text-2xl font-bold">{winPercentage}%</p>
            </CardContent>
          </Card>
        </div>
        </div>
    );
}