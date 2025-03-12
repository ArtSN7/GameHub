import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center text-[#666666] hover:text-blue-500 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-full">
            <Search className="h-12 w-12 text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-4">Page Not Found</h1>

          <p className="text-[#666666] mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>

          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-2 rounded-xl text-white font-medium">
              Return back
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

