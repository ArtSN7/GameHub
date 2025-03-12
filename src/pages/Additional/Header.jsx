import { Link }from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, Spade } from "lucide-react"


export default function Header() {
    return(
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-[#e2e8f0]">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-1.5 rounded-lg">
            <Spade className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight">GameHub</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/bets" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Bets
          </Link>
          <Link to="/leaderboard" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Leaderboard
          </Link>
          <Link to="/balance" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Balance
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/profile" className="relative"> {/* Changed href to to for react-router-dom */}
              <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-blue-500 object-cover transition-transform hover:scale-105"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-[#64748b]">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
    );
}