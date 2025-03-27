"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle } from "lucide-react"

export default function Promocodes({ 
  promocode, 
  setPromocode, 
  promocodeStatus, 
  setPromocodeStatus, 
  handleRedeemPromocode 
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Redeem Promocode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#64748b]">
          Enter a valid promocode to receive bonus coins or special rewards.
        </p>

        {promocodeStatus && (
          <Alert
            variant={promocodeStatus.success ? "default" : "destructive"}
            className={promocodeStatus.success ? "bg-green-50 border-green-200 text-green-800" : ""}
          >
            {promocodeStatus.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
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
          <Button 
            className="bg-blue-500 hover:bg-blue-600" 
            onClick={handleRedeemPromocode}
          >
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
    </Card>
  )
}