import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Clock, Play, RefreshCw } from "lucide-react"


export default function AdsSection(){

    const [currentAd, setCurrentAd] = useState(null)
    const [adProgress, setAdProgress] = useState(0)
    const [adPlaying, setAdPlaying] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [rewardHistory, setRewardHistory] = useState([])
    const [showAdDialog, setShowAdDialog] = useState(false)
    

        // Available ads
        const [availableAds, setAvailableAds] = useState([
            {
              id: 1,
              title: "Casino Royale",
              description: "Watch a 30-second ad to earn 200 coins",
              reward: 200,
              duration: 30,
              image: "/placeholder.svg?height=120&width=200",
              available: true,
            },
            {
              id: 2,
              title: "Slots Mania",
              description: "Watch a 15-second ad to earn 100 coins",
              reward: 100,
              duration: 15,
              image: "/placeholder.svg?height=120&width=200",
              available: true,
            },
          ])

      // Claim ad reward
  const claimAdReward = () => {
    if (currentAd) {
      setCoins(coins + currentAd.reward)
      setShowConfetti(true)

      // Add to history
      const historyItem = {
        id: Date.now(),
        type: "ad",
        title: currentAd.title,
        reward: currentAd.reward,
        timestamp: new Date(),
      }
      setRewardHistory([historyItem, ...rewardHistory])

      // Close dialog after a delay
      setTimeout(() => {
        setShowAdDialog(false)
        setShowConfetti(false)
      }, 2000)
    }
  }


     // Simulate watching an ad
     const watchAd = (ad) => {
        setCurrentAd(ad)
        setAdProgress(0)
        setAdPlaying(true)
        setShowAdDialog(true)
    
        // Simulate ad progress
        const interval = setInterval(() => {
          setAdProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              setAdPlaying(false)
              return 100
            }
            return prev + (100 / ad.duration) * 0.1
          })
        }, 100)
      }
    

    const generateMoreAds = () => {
        return [
          {
            id: Date.now() + 1,
            title: "Poker Masters",
            description: "Watch a 20-second ad to earn 150 coins",
            reward: 150,
            duration: 20,
            image: "/placeholder.svg?height=120&width=200",
            available: true,
          },
          {
            id: Date.now() + 2,
            title: "Blackjack Pro",
            description: "Watch a 25-second ad to earn 180 coins",
            reward: 180,
            duration: 25,
            image: "/placeholder.svg?height=120&width=200",
            available: true,
          },
        ]
      }


    return(



    <div>
                  <h3 className="text-lg font-medium mb-3">Watch Ads for Coins</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableAds.map((ad) => (
                      <Card key={ad.id} className="border border-[#e2e8f0] overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative h-24">
                            <img src={ad.image || "/placeholder.svg"} alt={ad.title} fill className="object-cover" />
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
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => setAvailableAds([...availableAds, ...generateMoreAds()])}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Load More Ads
                    </Button>
                  </div>
                </div>

        
    )
}