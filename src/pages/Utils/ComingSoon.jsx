import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock } from "lucide-react"

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">
        <main className="container px-4 py-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-full">
            <Clock className="h-12 w-12 text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-4">Coming Soon</h1>

          <p className="text-[#666666] mb-8 max-w-sm">
            This page is currently in development and will be available in future updates. Check back later for new
            exciting features!
          </p>

          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-6 rounded-xl text-white font-medium">
              Return back
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

