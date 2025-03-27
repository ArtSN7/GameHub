"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Coins } from "lucide-react"

export default function Bonuses({ claimBonus }) {
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false)
  const [weeklyBonusClaimed, setWeeklyBonusClaimed] = useState(false)

  const dailyBonuses = [
    {
      id: "daily",
      title: "Daily Bonus",
      description: "Claim your free daily bonus of 500 coins",
      reward: 500,
      cooldown: "24 hours",
      image: "/placeholder.svg?height=80&width=80",
      available: !dailyBonusClaimed,
    },
    {
      id: "weekly",
      title: "Weekly Bonus",
      description: "Claim your free weekly bonus of 2000 coins",
      reward: 2000,
      cooldown: "7 days",
      image: "/placeholder.svg?height=80&width=80",
      available: !weeklyBonusClaimed,
    },
  ]

  const handleClaim = (bonus) => {
    claimBonus(bonus)
    if (bonus.id === "daily") {
      setDailyBonusClaimed(true)
    } else if (bonus.id === "weekly") {
      setWeeklyBonusClaimed(true)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Daily Bonuses</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dailyBonuses.map((bonus) => (
          <Card
            key={bonus.id}
            className={`border border-[#e2e8f0] overflow-hidden transition-opacity ${
              !bonus.available ? "opacity-70" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <img
                    src={bonus.image}
                    alt={bonus.title}
                    className="object-cover rounded-lg w-full h-full"
                  />
                  {bonus.id === "daily" && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </div>
                  )}
                  {bonus.id === "weekly" && (
                    <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      7
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-medium text-base">{bonus.title}</h3>
                  <p className="text-xs text-[#64748b]">{bonus.description}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 font-bold text-green-600">
                    <Coins className="h-4 w-4" />
                    <span>{bonus.reward}</span>
                  </div>
                  <Button
                    size="sm"
                    className={`${
                      bonus.available 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!bonus.available}
                    onClick={() => bonus.available && handleClaim(bonus)}
                  >
                    {bonus.available ? "Claim" : "Claimed"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}