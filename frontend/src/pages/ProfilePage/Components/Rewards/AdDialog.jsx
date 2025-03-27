"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, Coins } from "lucide-react"
import { motion } from "framer-motion"

export default function AdDialog({ 
  showAdDialog, 
  setShowAdDialog, 
  adPlaying, 
  currentAd, 
  adProgress, 
  claimAdReward 
}) {
  return (
    <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{adPlaying ? "Watching Ad" : "Ad Completed"}</DialogTitle>
        </DialogHeader>

        {adPlaying ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${adProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center text-sm text-[#64748b]">
              Please wait while the ad plays...
              <div className="font-medium mt-1">
                {Math.ceil((currentAd?.duration || 0) * (1 - adProgress / 100))} seconds remaining
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-green-500" />
              </motion.div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Thanks for watching!</h3>
              <p className="text-[#64748b] mb-4">You've earned {currentAd?.reward} coins</p>
              <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600">
                <Coins className="h-5 w-5" />
                <span>+{currentAd?.reward}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {adPlaying ? (
            <Button variant="outline" disabled>
              Skip (unavailable)
            </Button>
          ) : (
            <Button onClick={claimAdReward} className="w-full bg-blue-500 hover:bg-blue-600">
              Claim Reward
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}