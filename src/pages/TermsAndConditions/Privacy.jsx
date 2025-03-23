import {Link} from "react-router-dom"
import { ArrowLeft, Shield, Cookie, Lock, UserCheck, Globe, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Footer from "../Utils/Footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-[#e2e8f0]">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center text-[#64748b] hover:text-blue-500 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-[#64748b]">Last updated: March 19, 2025</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Shield className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium mb-1">Data Protection</h3>
              <p className="text-sm text-[#64748b]">
                We implement robust security measures to protect your personal data
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <UserCheck className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium mb-1">Your Rights</h3>
              <p className="text-sm text-[#64748b]">You have control over your data and how it's used</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Cookie className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium mb-1">Cookie Policy</h3>
              <p className="text-sm text-[#64748b]">Transparent information about how we use cookies</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <p className="mb-6 text-[#334155]">
              At GameHub, we are committed to protecting your privacy and ensuring the security of your personal
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our platform.
            </p>

            <p className="mb-6 text-[#334155]">
              We encourage you to read this Privacy Policy carefully to understand our practices regarding your personal
              data. By accessing or using GameHub, you acknowledge that you have read and understood this Privacy
              Policy.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-[#e2e8f0]">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-blue-500" />
                    Information We Collect
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#334155] pb-4">
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <p className="mb-4">We may collect personal information that you provide directly to us, such as:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Name, email address, and other contact information</li>
                    <li>Account credentials, such as username and password</li>
                    <li>Profile information, including profile picture and bio</li>
                    <li>
                      Payment information, such as credit card details (stored securely through our payment processors)
                    </li>
                    <li>Communication preferences and settings</li>
                  </ul>

                  <h4 className="font-medium mb-2">Usage Information</h4>
                  <p className="mb-4">
                    We automatically collect certain information about your use of GameHub, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Log data, such as IP address, browser type, pages visited, and time spent</li>
                    <li>Device information, including device type, operating system, and unique identifiers</li>
                    <li>Game play data, such as scores, achievements, and in-game purchases</li>
                    <li>Location information (if you grant permission)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-[#e2e8f0]">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-blue-500" />
                    How We Use Your Information
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#334155] pb-4">
                  <p className="mb-4">We use the information we collect for various purposes, including:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Providing, maintaining, and improving GameHub</li>
                    <li>Processing transactions and managing your account</li>
                    <li>Personalizing your experience and delivering relevant content</li>
                    <li>Communicating with you about updates, promotions, and other news</li>
                    <li>Analyzing usage patterns and optimizing our services</li>
                    <li>Detecting and preventing fraudulent activity and security breaches</li>
                    <li>Complying with legal obligations and enforcing our terms</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-[#e2e8f0]">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-500" />
                    Information Sharing and Disclosure
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#334155] pb-4">
                  <p className="mb-4">We may share your information in the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>With service providers who perform services on our behalf</li>
                    <li>With other users, as part of your public profile and game interactions</li>
                    <li>In connection with a business transaction, such as a merger or acquisition</li>
                    <li>When required by law or to protect our rights and safety</li>
                    <li>With your consent or at your direction</li>
                  </ul>
                  <p className="mt-4">
                    We do not sell your personal information to third parties for their marketing purposes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-[#e2e8f0]">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center">
                    <Cookie className="h-5 w-5 mr-2 text-blue-500" />
                    Cookies and Similar Technologies
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#334155] pb-4">
                  <p className="mb-4">
                    We use cookies and similar technologies to collect information about your browsing activities and to
                    distinguish you from other users. Cookies help us provide you with a better experience by:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Remembering your preferences and settings</li>
                    <li>Keeping you logged in to your account</li>
                    <li>Understanding how you use our platform</li>
                    <li>Personalizing content and advertisements</li>
                    <li>Analyzing the performance of our website</li>
                  </ul>
                  <p>
                    You can control cookies through your browser settings. However, disabling cookies may limit your
                    ability to use certain features of GameHub.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-[#e2e8f0]">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
                    Your Rights and Choices
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#334155] pb-4">
                  <p className="mb-4">
                    Depending on your location, you may have certain rights regarding your personal information,
                    including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Accessing and updating your information</li>
                    <li>Requesting deletion of your data</li>
                    <li>Objecting to certain processing activities</li>
                    <li>Requesting a copy of your data in a portable format</li>
                    <li>Withdrawing consent for optional processing</li>
                    <li>Opting out of marketing communications</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us using the information provided at the end of this
                    Privacy Policy.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                    Data Security and Retention
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#334155] pb-4">
                  <p className="mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information
                    against unauthorized access, disclosure, alteration, and destruction. However, no method of
                    transmission over the Internet or electronic storage is 100% secure.
                  </p>
                  <p className="mb-4">
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in
                    this Privacy Policy, unless a longer retention period is required or permitted by law. When
                    determining how long to retain information, we consider:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>The amount, nature, and sensitivity of the information</li>
                    <li>The potential risk of harm from unauthorized use or disclosure</li>
                    <li>The purposes for which we process the information</li>
                    <li>Legal and regulatory requirements</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-[#64748b] mb-4">
            If you have any questions about our Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@gamehub.com" className="text-blue-500 hover:underline">
              privacy@gamehub.com
            </a>
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/terms">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

