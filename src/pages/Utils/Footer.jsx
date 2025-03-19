import { Link }from "react-router-dom"
import { Spade } from "lucide-react"


export default function Footer() {

    return(
        <footer className="border-t border-[#e2e8f0] py-8 mt-16 bg-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-1.5 rounded-lg">
                <Spade className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">GameHub</span>
            </div>

            <div className="flex gap-8 text-sm">
              <Link href="#" className="text-[#64748b] hover:text-blue-500 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-[#64748b] hover:text-blue-500 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-[#64748b] hover:text-blue-500 transition-colors">
                Support
              </Link>
            </div>

            <div className="text-sm text-[#64748b]">© {new Date().getFullYear()} GameHub. All rights reserved.</div>
          </div>
        </div>
      </footer>
    );

}