"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Gift, Coins } from "lucide-react";
import { motion } from "framer-motion";

import Footer from "../Utils/Footer";
import InGameHeader from "../Utils/InGameHeader";
import { useUser } from './../../components/App';
import GameStats from "./Components/Stats/GameStats";
import OverallStats from "./Components/Stats/OverallStats";
import ProfileHeader from "./Components/ProfileHeader";
import Bonuses from "./Components/Rewards/Bonuses";
import AvailableAds from "./Components/Rewards/AvailableAds";
import AdDialog from "./Components/Rewards/AdDialog";
import SpecialBonuses from "./Components/Rewards/SpecialBonuses";
import Promocodes from "./Components/Promocodes/Promocodes";
import { initialAds, watchAdFunc, claimAdRewardFunc, generateMoreAds } from "./Components/Rewards/AdUtils";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [coins, setCoins] = useState(0);
  const [stats, setStats] = useState(null);
  const [bonuses, setBonuses] = useState(null);
  const [totalWins, setTotalWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [promocode, setPromocode] = useState("");
  const [promocodeStatus, setPromocodeStatus] = useState(null);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [adProgress, setAdProgress] = useState(0);
  const [adPlaying, setAdPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [availableAds, setAvailableAds] = useState(initialAds);

  const formatTime = async (time) => {

    const date = new Date(time);
    const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date);

    return fullDate;

  }

  // Fetch user data from the backend
  const fetchUserData = async () => {
    if (!user.dbUser?.id) {
      console.error('No user ID available');
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.dbUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData({
        username: data.username,
        memberSince: await formatTime(data.createdAt),
        level: data.level || 1,
        rating: data.rating || 0.0,
        hoursPlayed: data.hoursPlayed || 0.0,
        profileImage: user.telegramUser?.photoUrl || '',
      });
      console.log(data.balance)
      setCoins(data.balance || 0);
      setStats(data.stats);
      setBonuses(data.bonuses);
      setTotalWins(data.total_wins || 0);
      setTotalGames(data.total_games || 0);

      // Update user context with latest data
      setUser((prev) => ({
        ...prev,
        dbUser: {
          ...prev.dbUser,
          ...data,
        },
      }));
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user.dbUser?.id, setUser]);

  const watchAd = (ad) => watchAdFunc(ad, setCurrentAd, setAdProgress, setAdPlaying, setShowAdDialog);

  const claimAdReward = () => {
    const updatedCoins = coins + currentAd.reward;
    setCoins(updatedCoins);
    setShowConfetti(true);

    // Update balance in the database
    fetch(`/api/users/${user.dbUser.id}/balance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ balance: updatedCoins }),
    }).then((response) => {
      if (!response.ok) {
        console.error('Failed to update balance');
      }
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 2000);

    setShowAdDialog(false);
  };

  const claimBonus = async (bonus) => {
    const updatedCoins = coins + bonus.reward;
    setCoins(updatedCoins);
    setShowConfetti(true);

    try {
      // Update balance in the database
      await fetch(`/api/users/${user.dbUser.id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance: updatedCoins }),
      });

      // Update bonus in the database
      await fetch(`/api/users/${user.dbUser.id}/bonus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bonusType: bonus.type }),
      });

      // Refresh user data
      await fetchUserData();
    } catch (error) {
      console.error('Error claiming bonus:', error.message);
    }

    setTimeout(() => {
      setShowConfetti(false);
    }, 2000);
  };

  const handleRedeemPromocode = async () => {
    if (!promocode.trim()) {
      setPromocodeStatus({ success: false, message: "Please enter a promocode" });
      return;
    }

    let reward = 0;
    let message = '';
    if (promocode.toLowerCase() === "bonus100") {
      reward = 1000;
      message = "Successfully redeemed 1,000 coins!";
    } else if (promocode.toLowerCase() === "welcome500") {
      reward = 500;
      message = "Successfully redeemed 500 coins!";
    } else {
      setPromocodeStatus({ success: false, message: "Invalid promocode. Please try again." });
      setTimeout(() => setPromocodeStatus(null), 3000);
      return;
    }

    const updatedCoins = coins + reward;
    setCoins(updatedCoins);
    setPromocodeStatus({ success: true, message });
    setPromocode("");

    try {
      // Update balance in the database
      await fetch(`/api/users/${user.dbUser.id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance: updatedCoins }),
      });

      // Update promo code in the database
      await fetch(`/api/users/${user.dbUser.id}/bonus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bonusType: 'promoCode', promoCode: promocode }),
      });

      // Refresh user data
      await fetchUserData();
    } catch (error) {
      console.error('Error redeeming promocode:', error.message);
    }

    setTimeout(() => setPromocodeStatus(null), 3000);
  };

  if (!userData || !stats || !bonuses) {
    return <div>Loading profile...</div>;
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
                <OverallStats total_wins={totalWins} total_games={totalGames} />
                <div>
                  <h3 className="text-lg font-medium mb-3">Game Performance</h3>
                  <div className="space-y-4">
                    <GameStats stats={stats} />
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
                <Bonuses claimBonus={claimBonus} bonuses={bonuses} />
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
                <SpecialBonuses claimBonus={claimBonus} bonuses={bonuses} />
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
              usedPromoCode={bonuses.promoCodeUsed}
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
  );
}