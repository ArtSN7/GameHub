"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Star, Clock, Coins, Gift, Edit, Save, Check, AlertCircle, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import Footer from "../Utils/Footer"
import InGameHeader from "../Utils/InGameHeader"

import { useUser } from './../../components/App'; // Adjust path if needed

export default function ProfilePage() {
  const { user, setUser } = useUser();

  const [coins, setCoins] = useState(24680)
  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState({
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

  // Handle promocode redemption
  const handleRedeemPromocode = () => {
    if (!promocode.trim()) {
      setPromocodeStatus({
        success: false,
        message: "Please enter a promocode",
      })
      return
    }

    // Simulate promocode validation
    if (promocode.toLowerCase() === "bonus100") {
      setCoins(coins + 1000)
      setPromocodeStatus({
        success: true,
        message: "Successfully redeemed 1,000 coins!",
      })
      setPromocode("")
    } else if (promocode.toLowerCase() === "welcome500") {
      setCoins(coins + 500)
      setPromocodeStatus({
        success: true,
        message: "Successfully redeemed 500 coins!",
      })
      setPromocode("")
    } else {
      setPromocodeStatus({
        success: false,
        message: "Invalid promocode. Please try again.",
      })
    }

    // Clear status after 3 seconds
    setTimeout(() => {
      setPromocodeStatus(null)
    }, 3000)
  }

  // Handle profile edit toggle
  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  // Handle profile save
  const saveProfile = () => {
    setEditMode(false)
    // Here you would typically save the data to a backend
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <InGameHeader coins={coins} IsShowGuide={false} />

      {/* Main Content */}

      <main className="container px-4 py-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-blue-500 object-cover"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
              </div>

              <div className="text-center md:text-left flex-1">
                {
                  <>
                    <h1 className="text-2xl font-bold mb-1">{userData.username}</h1>
                    <p className="text-[#64748b] mb-4">Member since {userData.memberSince}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Level {userData.level}</span>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="account" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Game Stats
            </TabsTrigger>
            <TabsTrigger value="promocodes" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Promocodes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Stats */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Overall Performance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-3 sm:p-4">
                        <h3 className="text-sm font-medium text-[#64748b] mb-1">Total Wins</h3>
                        <p className="text-2xl font-bold">248</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-3 sm:p-4">
                        <h3 className="text-sm font-medium text-[#64748b] mb-1">Total Games</h3>
                        <p className="text-2xl font-bold">412</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-3 sm:p-4">
                        <h3 className="text-sm font-medium text-[#64748b] mb-1">Win Rate</h3>
                        <p className="text-2xl font-bold">60.2%</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Game-specific Stats */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Game Performance</h3>
                  <div className="space-y-4">
                    {/* Blackjack */}
                    <div className="bg-white p-4 rounded-lg border border-[#e2e8f0]">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Blackjack</h4>
                        <Badge className="bg-blue-500">42 Games</Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-[#64748b]">Wins</p>
                          <p className="font-medium">26</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Losses</p>
                          <p className="font-medium">16</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Win Rate</p>
                          <p className="font-medium">61.9%</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Biggest Win</p>
                          <p className="font-medium">1,200</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "61.9%" }}></div>
                      </div>
                    </div>

                    {/* Roulette */}
                    <div className="bg-white p-4 rounded-lg border border-[#e2e8f0]">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Roulette</h4>
                        <Badge className="bg-red-500">78 Games</Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-[#64748b]">Wins</p>
                          <p className="font-medium">45</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Losses</p>
                          <p className="font-medium">33</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Win Rate</p>
                          <p className="font-medium">57.7%</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Biggest Win</p>
                          <p className="font-medium">3,500</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "57.7%" }}></div>
                      </div>
                    </div>

                    {/* Slots */}
                    <div className="bg-white p-4 rounded-lg border border-[#e2e8f0]">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Slots</h4>
                        <Badge className="bg-yellow-500">124 Games</Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-[#64748b]">Wins</p>
                          <p className="font-medium">68</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Losses</p>
                          <p className="font-medium">56</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Win Rate</p>
                          <p className="font-medium">54.8%</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Biggest Win</p>
                          <p className="font-medium">5,200</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "54.8%" }}></div>
                      </div>
                    </div>

                    {/* Plinko */}
                    <div className="bg-white p-4 rounded-lg border border-[#e2e8f0]">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Plinko</h4>
                        <Badge className="bg-green-500">95 Games</Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-[#64748b]">Wins</p>
                          <p className="font-medium">62</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Losses</p>
                          <p className="font-medium">33</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Win Rate</p>
                          <p className="font-medium">65.3%</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Biggest Win</p>
                          <p className="font-medium">2,800</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "65.3%" }}></div>
                      </div>
                    </div>

                    {/* Texas Hold'em */}
                    <div className="bg-white p-4 rounded-lg border border-[#e2e8f0]">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Texas Hold'em</h4>
                        <Badge className="bg-purple-500">73 Games</Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-[#64748b]">Wins</p>
                          <p className="font-medium">47</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Losses</p>
                          <p className="font-medium">26</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Win Rate</p>
                          <p className="font-medium">64.4%</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Biggest Win</p>
                          <p className="font-medium">4,500</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "64.4%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promocodes" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Redeem Promocode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#64748b]">Enter a valid promocode to receive bonus coins or special rewards.</p>

                {promocodeStatus && (
                  <Alert
                    variant={promocodeStatus.success ? "default" : "destructive"}
                    className={promocodeStatus.success ? "bg-green-50 border-green-200 text-green-800" : ""}
                  >
                    {promocodeStatus.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{promocodeStatus.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter promocode"
                      value={promocode}
                      onChange={(e) => setPromocode(e.target.value)}
                    />
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleRedeemPromocode}>
                    Redeem
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Available Promocodes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-blue-100">
                      <Badge className="bg-blue-500">BONUS100</Badge>
                      <span className="text-sm">1,000 coins bonus</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-blue-100">
                      <Badge className="bg-green-500">WELCOME500</Badge>
                      <span className="text-sm">500 coins bonus</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2">
                    * For demonstration purposes only. In a real app, promocodes would not be displayed here.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-[#64748b]">
                  Promocodes can be found in our newsletters, social media, or special events.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}