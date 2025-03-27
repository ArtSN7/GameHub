import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SpecialBonuses({ claimBonus, bonuses }) {
  const specialBonus = {
    type: "special",
    title: "Special Bonus",
    reward: 1000,
    disabled: bonuses.specialBonusesCollected > 0,
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Special Bonuses</h3>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span>{specialBonus.title} - {specialBonus.reward} Coins</span>
            <Button
              onClick={() => claimBonus(specialBonus)}
              disabled={specialBonus.disabled}
              className={specialBonus.disabled ? "bg-gray-300" : "bg-blue-500"}
            >
              {specialBonus.disabled ? "Claimed" : "Claim"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}