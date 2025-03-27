"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins } from "lucide-react"

export default function SpecialBonuses({ claimBonus }) {
  const specialBonuses = [
    {
      id: "welcome",
      title: "Welcome Bonus",
      description: "New players get a special welcome bonus of 1000 coins!",
      reward: 1000,
      image: "/placeholder.svg?height=120&width=200",
      badge: { text: "Limited Time", className: "bg-blue-100 text-blue-700" },
      available: true,
    },
    {
      id: "comeback",
      title: "Comeback Bonus",
      description: "Returning after 3+ days? Here's a bonus of 750 coins!",
      reward: 750,
      image: "/placeholder.svg?height=120&width=200",
      badge: { text: "Special", className: "bg-purple-100 text-purple-700" },
      available: true,
    },
    {
      id: "weekend",
      title: "Weekend Bonus",
      description: "Play on weekends and get a bonus of 500 coins!",
      reward: 500,
      image: "/placeholder.svg?height=120&width=200",
      badge: { text: "Weekend Only", className: "bg-green-100 text-green-700" },
      available: true,
    },
  ]

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Special Rewards</h3>
      <div className="space-y-3">
        {specialBonuses.map((bonus) => (
          <Card key={bonus.id} className="border border-[#e2e8f0] overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-32 md:h-auto flex-shrink-0">
                  <img
                    src={bonus.image}
                    alt={bonus.title}
                    className="object-cover w-full h-full"
                  />
                  {bonus.id === "welcome" && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-lg">{bonus.title}</h3>
                      <Badge className={`${bonus.badge.className} font-normal`}>
                        {bonus.badge.text}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#64748b] mb-4">{bonus.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                      <Coins className="h-4 w-4" />
                      <span>{bonus.reward}</span>
                    </div>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={!bonus.available}
                      onClick={() => claimBonus(bonus)}
                    >
                      {bonus.available ? "Claim Offer" : "Claimed"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}