"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Gift, Coins } from "lucide-react"
import { motion } from "framer-motion"

import Footer from "../Utils/Footer"
import InGameHeader from "../Utils/InGameHeader"
import { useUser } from './../../components/App'
import GameStats from "./Components/Stats/GameStats"
import OverallStats from "./Components/Stats/OverallStats"
import ProfileHeader from "./Components/ProfileHeader"
import Bonuses from "./Components/Rewards/Bonuses"
import AvailableAds from "./Components/Rewards/AvailableAds"
import AdDialog from "./Components/Rewards/AdDialog"
import SpecialBonuses from "./Components/Rewards/SpecialBonuses"
import Promocodes from "./Components/Promocodes/Promocodes"
import { initialAds, watchAdFunc, claimAdRewardFunc, generateMoreAds } from "./Components/Rewards/AdUtils"

export default function ProfilePage() {
  const { user } = useUser()
  
  const [coins, setCoins] = useState(24680)
  const [userData] = useState({
    username: user.username,
    email: user.first_name + " " + user.last_name,
    memberSince: "January 2023",
    level: 12,
    rating: 4.8,
    hoursPlayed: 120,
    profileImage: user.photoUrl,
  })
  const [promocode, setPromocode] = useState("")
  const [promocodeStatus, setPromocodeStatus] = useState(null)
  const [showAdDialog, setShowAdDialog] = useState(false)
  const [currentAd, setCurrentAd] = useState(null)
  const [adProgress, setAdProgress] = useState(0)
  const [adPlaying, setAdPlaying] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [availableAds, setAvailableAds] = useState(initialAds)

  const watchAd = (ad) => watchAdFunc(ad, setCurrentAd, setAdProgress, setAdPlaying, setShowAdDialog)
  
  const claimAdReward = () => claimAdRewardFunc(
    currentAd, 
    coins, 
    setCoins, 
    setShowConfetti, 
    setRewardHistory, 
    setShowAdDialog
  )

  const claimBonus = (bonus) => {
    setCoins(coins + bonus.reward)
    setShowConfetti(true)

    const historyItem = {
      id: Date.now(),
      type: "bonus",
      title: bonus.title,
      reward: bonus.reward,
      timestamp: new Date(),
    }
    setRewardHistory(prev => [historyItem, ...prev])

    setTimeout(() => {
      setShowConfetti(false)
    }, 2000)
  }

  const handleRedeemPromocode = () => {
    if (!promocode.trim()) {
      setPromocodeStatus({ success: false, message: "Please enter a promocode" })
      return
    }

    if (promocode.toLowerCase() === "bonus100") {
      setCoins(coins + 1000)
      setPromocodeStatus({ success: true, message: "Successfully redeemed 1,000 coins!" })
      setPromocode("")
    } else if (promocode.toLowerCase() === "welcome500") {
      setCoins(coins + 500)
      setPromocodeStatus({ success: true, message: "Successfully redeemed 500 coins!" })
      setPromocode("")
    } else {
      setPromocodeStatus({ success: false, message: "Invalid promocode. Please try again." })
    }

    setTimeout(() => setPromocodeStatus(null), 3000)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <InGameHeader coins={coins} IsShowGuide={false} />
      
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <ProfileHeader userData={userData} />

        <Tabs defaultValue="stats" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Game Stats
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="promocodes" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Promocodes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <OverallStats total_wins={20} total_games={100} />
                <div>
                  <h3 className="text-lg font-medium mb-3">Game Performance</h3>
                  <div className="space-y-4">
                    <GameStats />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-500" />
                  Rewards Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Bonuses claimBonus={claimBonus} />
                <AvailableAds availableAds={availableAds} watchAd={watchAd} />
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setAvailableAds([...availableAds, ...generateMoreAds()])}
                  >
                    Load More Ads
                  </Button>
                </div>
                <SpecialBonuses claimBonus={claimBonus} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promocodes" className="mt-6">
            <Promocodes 
              promocode={promocode}
              setPromocode={setPromocode}
              promocodeStatus={promocodeStatus}
              setPromocodeStatus={setPromocodeStatus}
              handleRedeemPromocode={handleRedeemPromocode}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <AdDialog 
        showAdDialog={showAdDialog}
        setShowAdDialog={setShowAdDialog}
        adPlaying={adPlaying}
        currentAd={currentAd}
        adProgress={adProgress}
        claimAdReward={claimAdReward}
      />
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              }}
              animate={{
                top: "110%",
                left: `${Math.random() * 100}%`,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: Math.random() * 2 + 2, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </div>
  )
}