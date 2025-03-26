import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "../Utils/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-[#e2e8f0]">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link
            to="/"
            className="flex items-center text-[#64748b] hover:text-blue-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-[#64748b]">Last updated: March 23, 2025</p>
        </div>

        <Tabs defaultValue="terms" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="conduct">Code of Conduct</TabsTrigger>
            <TabsTrigger value="currency">In-Game Currency</TabsTrigger>
          </TabsList>
          <TabsContent value="terms" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4 text-[#334155]">
                  By accessing or using GameHob (the "Service"), including its Telegram mini-app, web
                  version, or mobile application, you agree to be bound by these Terms of Service. If you do not agree,
                  you must not use the Service.
                </p>

                <h2 className="text-xl font-semibold mb-4">2. Eligibility</h2>
                <p className="mb-4 text-[#334155]">
                  You must be at least 18 years old to use the Service. By using the Service, you represent and warrant
                  that you are at least 18 years of age and have the legal capacity to agree to these terms.
                </p>

                <h2 className="text-xl font-semibold mb-4">3. Nature of the Service</h2>
                <p className="mb-4 text-[#334155]">
                  GameHob is an entertainment platform offering games such as blackjack, scratch cards,
                  slots, and Plinko. The Service uses only in-game currency ("Coins") earned through watching ads,
                  collecting bonuses, or redeeming promo codes. No real money gambling is offered or permitted.
                </p>

                <h2 className="text-xl font-semibold mb-4">4. Account Registration</h2>
                <p className="mb-4 text-[#334155]">
                  You may need to register an account to access certain features. You agree to provide accurate and
                  current information during registration and to update it as needed. You are responsible for all
                  activities under your account.
                </p>

                <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
                <p className="mb-4 text-[#334155]">
                  All content, including games, graphics, logos, and software, is the property of GameHob
                  or its licensors and is protected by copyright, trademark, and other intellectual property laws. You
                  may not reproduce or distribute any content without permission.
                </p>

                <h2 className="text-xl font-semibold mb-4">6. Prohibited Activities</h2>
                <p className="mb-4 text-[#334155]">
                  You may not attempt to convert Coins into real money, hack or exploit the Service, use automated
                  systems (e.g., bots), or engage in any activity that disrupts the Service or other users’ enjoyment.
                </p>

                <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
                <p className="mb-4 text-[#334155]">
                  We may suspend or terminate your access to the Service at our discretion, without notice, if you
                  violate these Terms or engage in harmful conduct.
                </p>

                <h2 className="text-xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
                <p className="mb-4 text-[#334155]">
                  The Service is provided "as is" without warranties of any kind, including merchantability or fitness
                  for a particular purpose. We do not guarantee uninterrupted access or error-free operation.
                </p>

                <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="mb-4 text-[#334155]">
                  GameHob, its affiliates, and partners shall not be liable for any indirect,
                  consequential, or incidental damages arising from your use of the Service, including loss of Coins or
                  data.
                </p>

                <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
                <p className="mb-4 text-[#334155]">
                  We may update these Terms at any time. Changes will be posted on the Service with an updated "Last
                  updated" date. Continued use after changes constitutes acceptance.
                </p>

                <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
                <p className="text-[#334155]">
                  These Terms are governed by the laws of UK, without regard to conflict of law
                  principles.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="conduct" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Code of Conduct</h2>
                <p className="mb-4 text-[#334155]">
                  We aim to create a fun and respectful environment for all users of GameHob. This Code of
                  Conduct outlines expected behavior.
                </p>

                <h3 className="text-lg font-medium mb-2">Respectful Interaction</h3>
                <p className="mb-4 text-[#334155]">
                  Treat others with respect. Harassment, hate speech, or offensive behavior based on race, gender,
                  religion, or other traits is prohibited.
                </p>

                <h3 className="text-lg font-medium mb-2">Fair Use</h3>
                <p className="mb-4 text-[#334155]">
                  Do not cheat, exploit bugs, or use third-party tools to manipulate gameplay or earn Coins unfairly.
                </p>

                <h3 className="text-lg font-medium mb-2">Content Guidelines</h3>
                <p className="mb-4 text-[#334155]">
                  Do not share or promote illegal, offensive, or inappropriate content through the Service.
                </p>

                <h3 className="text-lg font-medium mb-2">Account Security</h3>
                <p className="mb-4 text-[#334155]">
                  Do not share your account with others. You are responsible for securing your login details.
                </p>

                <h3 className="text-lg font-medium mb-2">Reporting Issues</h3>
                <p className="mb-4 text-[#334155]">
                  Report violations to our support team. We will investigate and take appropriate action.
                </p>

                <h3 className="text-lg font-medium mb-2">Consequences</h3>
                <p className="text-[#334155]">
                  Violations may lead to warnings, suspension, or permanent bans, depending on severity.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="currency" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">In-Game Currency Terms</h2>
                <p className="mb-4 text-[#334155]">
                  These terms govern the use of in-game currency ("Coins") on GameHob.
                </p>

                <h3 className="text-lg font-medium mb-2">Earning Coins</h3>
                <p className="mb-4 text-[#334155]">
                  Coins can be earned by watching ads, collecting bonuses, or redeeming promo codes. Coins have no
                  real-world value and cannot be exchanged for cash or other monetary value.
                </p>

                <h3 className="text-lg font-medium mb-2">Use of Coins</h3>
                <p className="mb-4 text-[#334155]">
                  Coins are used solely for entertainment purposes within the Service to play games like blackjack,
                  scratch cards, slots, and Plinko. No real money gambling occurs.
                </p>

                <h3 className="text-lg font-medium mb-2">No Refunds or Transfers</h3>
                <p className="mb-4 text-[#334155]">
                  Coins are non-refundable and non-transferable. Lost Coins due to technical issues may not be restored,
                  though we may assist at our discretion.
                </p>

                <h3 className="text-lg font-medium mb-2">Promo Codes</h3>
                <p className="mb-4 text-[#334155]">
                  Promo codes may be offered at our discretion. Codes are subject to expiration and specific terms
                  provided at issuance.
                </p>

                <h3 className="text-lg font-medium mb-2">Account Termination</h3>
                <p className="mb-4 text-[#334155]">
                  If your account is terminated, any unused Coins will be forfeited without compensation.
                </p>

                <h3 className="text-lg font-medium mb-2">Changes to Currency Terms</h3>
                <p className="text-[#334155]">
                  We may modify these terms, including how Coins are earned or used, with notice provided via the
                  Service.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <p className="text-sm text-[#64748b] mb-4">
            Questions? Contact us at{" "}
            <a href="mailto:support@[yourdomain].com" className="text-blue-500 hover:underline">
              support@gamehob.com
            </a>
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/privacy">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}