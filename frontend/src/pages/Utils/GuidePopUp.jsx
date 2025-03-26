import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Star, Clock, Coins, Gift, Edit, Save, Check, AlertCircle, X, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function GuidePopUp({ showGuide, setShowGuide, title, description }) {
    return (
        <Dialog open={showGuide} onOpenChange={setShowGuide}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    title={title || "Guide"} // Fallback title if none provided
                    className="text-[#64748b] hover:text-blue-500 hover:bg-blue-50"
                >
                    <Sparkles className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title || "Guide"}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    {description || (
                        // Default content if no description is provided
                        <p className="text-xs text-[#64748b]">
                            No guide content provided.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}