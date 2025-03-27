"use client"

export const generateMoreAds = () => {
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

export const watchAdFunc = (ad, setCurrentAd, setAdProgress, setAdPlaying, setShowAdDialog) => {
  setCurrentAd(ad)
  setAdProgress(0)
  setAdPlaying(true)
  setShowAdDialog(true)

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

export const claimAdRewardFunc = (
  currentAd, 
  coins, 
  setCoins, 
  setShowConfetti, 
  setRewardHistory, 
  setShowAdDialog
) => {
  if (currentAd) {
    setCoins(coins + currentAd.reward)
    setShowConfetti(true)

    const historyItem = {
      id: Date.now(),
      type: "ad",
      title: currentAd.title,
      reward: currentAd.reward,
      timestamp: new Date(),
    }
    setRewardHistory(prev => [historyItem, ...prev])

    setTimeout(() => {
      setShowAdDialog(false)
      setShowConfetti(false)
    }, 2000)
  }
}

export const initialAds = [
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
]