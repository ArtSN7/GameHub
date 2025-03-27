import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Spade, X } from "lucide-react"; // Added X for closing the menu
import { useUser } from './../../components/App'; // Adjust path if needed
import { useState } from "react";

export default function Header() {
  const { user, setUser } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-[#e2e8f0]">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-1.5 rounded-lg">
            <Spade className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight">GameHob</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/bets"
            className="text-sm font-medium hover:text-blue-500 transition-colors"
          >
            Bets
          </Link>
          <Link
            to="/leaderboard"
            className="text-sm font-medium hover:text-blue-500 transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            to="/balance"
            className="text-sm font-medium hover:text-blue-500 transition-colors"
          >
            Balance
          </Link>
        </div>

        {/* Profile and Menu Button */}
        <div className="flex items-center gap-4">
          <Link to="/profile" className="relative">
            <img
              src={`${user.telegramUser.photoUrl}?height=40&width=40`}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-blue-500 object-cover transition-transform hover:scale-105"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#64748b]"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" /> // Close icon when menu is open
            ) : (
              <Menu className="h-5 w-5" /> // Menu icon when closed
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu (shown when toggled) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-[#e2e8f0] absolute top-16 left-0 w-full z-20">
          <div className="flex flex-col items-center py-4 space-y-4">
            <Link
              to="/bets"
              className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors"
              onClick={toggleMenu} // Close menu on link click
            >
              Bets
            </Link>
            <Link
              to="/leaderboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors"
              onClick={toggleMenu}
            >
              Leaderboard
            </Link>
            <Link
              to="/balance"
              className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors"
              onClick={toggleMenu}
            >
              Balance
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}