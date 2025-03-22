import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Star, Clock, Coins, Gift, Edit, Save, Check, AlertCircle, X, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import GuidePopUp from "./GuidePopUp"


export default function InGameHeader({ coins, IsShowGuide, title, description }) {
    const [showGuide, setShowGuide] = useState(false)

    return (
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-[#e2e8f0]">
            <div className="container flex items-center justify-between h-16 px-4">
                <Link to="/" className="flex items-center text-[#64748b] hover:text-blue-500 transition-colors">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Back to Games</span>
                </Link>

                <div className="flex items-center gap-4">

                    {/* Conditionally render Dialog Trigger based on showGuide */}
                    {IsShowGuide && (

                        <GuidePopUp 
                        showGuide={showGuide} 
                        setShowGuide={setShowGuide} 
                        title={title} 
                        description={description}/>
                        
                    )}

                    {/* Money count and Dialog button container */}
                    <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{coins.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}