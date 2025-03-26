import { Link }from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins } from "lucide-react"

export default function BalanceComponent() {
    return(
        <section className="mb-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#64748b] mb-1">Your Balance</h2>
                <p className="text-3xl font-bold flex items-center">
                  <Coins className="h-5 w-5 mr-2 text-blue-500" />
                  10,000
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 border-0 py-1 px-3">
                  <Wallet className="h-3.5 w-3.5 mr-1" /> Daily Bonus Available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
}