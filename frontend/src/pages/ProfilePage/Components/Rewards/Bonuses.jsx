import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Bonuses({ claimBonus, bonuses }) {
  const dailyBonus = {
    type: "daily",
    title: "Daily Bonus",
    reward: 100,
    disabled: bonuses.dailyBonusCollected > 0, // Disable if already collected
  };

  const weeklyBonus = {
    type: "weekly",
    title: "Weekly Bonus",
    reward: 500,
    disabled: bonuses.weeklyBonusCollected > 0,
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Daily & Weekly Bonuses</h3>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span>{dailyBonus.title} - {dailyBonus.reward} Coins</span>
            <Button
              onClick={() => claimBonus(dailyBonus)}
              disabled={dailyBonus.disabled}
              className={dailyBonus.disabled ? "bg-gray-300" : "bg-blue-500"}
            >
              {dailyBonus.disabled ? "Claimed" : "Claim"}
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span>{weeklyBonus.title} - {weeklyBonus.reward} Coins</span>
            <Button
              onClick={() => claimBonus(weeklyBonus)}
              disabled={weeklyBonus.disabled}
              className={weeklyBonus.disabled ? "bg-gray-300" : "bg-blue-500"}
            >
              {weeklyBonus.disabled ? "Claimed" : "Claim"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}