import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useUser } from './../../components/App';
import { useState, useEffect } from "react";

export default function BalanceComponent() {
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const { user } = useUser(); // Destructure user from useUser

  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user balance from backend
  const fetchUserBalance = async () => {
    if (!user.dbUser?.id) {
      console.error('No user ID available');
      setError('User not found. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/users/${user.dbUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setBalance(data.balance || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching user balance:', error.message);
      setError('Failed to load balance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balance when user.dbUser?.id is available
  useEffect(() => {
    if (user.dbUser?.id) {
      fetchUserBalance();
    } else {
      setIsLoading(true); // Keep loading until user ID is available
    }
  }, [user.dbUser?.id]); // Depend on user.dbUser?.id

  if (isLoading) {
    return (
      <section className="mb-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#64748b] mb-1">Your Balance</h2>
                <p className="text-lg text-[#333333]">Loading...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#64748b] mb-1">Your Balance</h2>
                <p className="text-lg text-red-500">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#64748b] mb-1">Your Balance</h2>
              <p className="text-3xl font-bold flex items-center">
                <Coins className="h-5 w-5 mr-2 text-blue-500" />
                {balance}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}