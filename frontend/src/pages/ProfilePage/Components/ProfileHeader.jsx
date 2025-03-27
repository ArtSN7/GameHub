import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export default function ProfileHeader({userData}){
    return(
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-blue-500 object-cover"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
              </div>

              <div className="text-center md:text-left flex-1">
                {
                  <>
                    <h1 className="text-2xl font-bold mb-1">{userData.username}</h1>
                    <p className="text-[#64748b] mb-4">Member since {userData.memberSince}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Level {userData.level}</span>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </CardContent>
        </Card>
    )
}