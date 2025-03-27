"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Play } from "lucide-react"

export default function AvailableAds({ availableAds, watchAd }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Watch Ads for Coins</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableAds.map((ad) => (
          <Card key={ad.id} className="border border-[#e2e8f0] overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-24">
                <img 
                  src={ad.image || "/placeholder.svg"} 
                  alt={ad.title} 
                  className="object-cover w-full h-full" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-3 text-white">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{ad.duration}s</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  +{ad.reward}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{ad.title}</h3>
                <p className="text-xs text-[#64748b] mb-2">{ad.description}</p>
                <Button
                  size="sm"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => watchAd(ad)}
                >
                  <Play className="h-3 w-3 mr-2" />
                  Watch Ad
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}