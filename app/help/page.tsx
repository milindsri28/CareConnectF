"use client"

import { useState } from "react"
import { Search, MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layouts/dashboard-layout"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      category: "Account & Settings",
      questions: [
        {
          question: "How do I change my password?",
          answer:
            "To change your password, go to Settings > Sign in & Security > Password. You'll need to enter your current password and then create a new one.",
        },
        {
          question: "How do I update my profile information?",
          answer:
            "You can update your profile information by going to your profile page and clicking the edit button next to each section you want to update.",
        },
        {
          question: "How do I control who can see my profile?",
          answer: "Go to Settings > Visibility to control who can see your profile, activity, and connections.",
        },
        {
          question: "How do I delete my account?",
          answer:
            "To delete your account, go to Settings > Account Management > Close Account. Please note that this action is permanent and cannot be undone.",
        },
      ],
    },
    {
      category: "Jobs & Applications",
      questions: [
        {
          question: "How do I search for jobs?",
          answer:
            "You can search for jobs by using the search bar on the Jobs page. You can filter by location, job type, experience level, and more.",
        },
        {
          question: "How do I apply for a job?",
          answer:
            "To apply for a job, click on the job listing to view details, then click the 'Apply' button. You may need to upload your resume and answer some questions.",
        },
        {
          question: "How do I track my job applications?",
          answer:
            "You can track your job applications by going to the Applications section in your dashboard. This shows all jobs you've applied for and their current status.",
        },
        {
          question: "How do I set job alerts?",
          answer:
            "To set job alerts, go to the Jobs page, perform a search with your criteria, then click 'Create Alert' to receive notifications when new matching jobs are posted.",
        },
      ],
    },
    {
      category: "Connections & Networking",
      questions: [
        {
          question: "How do I connect with other professionals?",
          answer:
            "You can connect with other professionals by visiting their profile and clicking the 'Connect' button. You can also add a personalized message with your connection request.",
        },
        {
          question: "How do I see my connection requests?",
          answer:
            "You can see your connection requests by going to the Connections page and clicking on the 'Pending' tab to view all pending requests.",
        },
        {
          question: "How do I remove a connection?",
          answer:
            "To remove a connection, go to the person's profile, click the 'More' button, and select 'Remove Connection'. They will not be notified when you remove them.",
        },
        {
          question: "How do I find people I may know?",
          answer:
            "CareConnect suggests people you may know based on your existing connections, workplace, education, and industry. You can find these suggestions on your Connections page.",
        },
      ],
    },
    {
      category: "Posts & Content",
      questions: [
        {
          question: "How do I create a post?",
          answer:
            "You can create a post by clicking on the 'Start a post' box on your home feed or profile page. You can add text, images, videos, or links to your post.",
        },
        {
          question: "Who can see my posts?",
          answer:
            "By default, your posts are visible to all your connections. You can change this when creating a post by selecting different audience options.",
        },
        {
          question: "How do I edit or delete a post?",
          answer:
            "To edit or delete a post, click the three dots (...) in the top right corner of your post and select 'Edit post' or 'Delete post'.",
        },
        {
          question: "How do I report inappropriate content?",
          answer:
            "To report inappropriate content, click the three dots (...) in the top right corner of the post and select 'Report'. Follow the prompts to complete your report.",
        },
      ],
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-2">Help Center</h1>
        <p className="text-gray-600 mb-6">Find answers to your questions and learn how to use CareConnect</p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for help topics"
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <MessageCircle className="w-10 h-10 text-[#0172af] mb-4" />
              <h3 className="font-medium mb-2">Chat Support</h3>
              <p className="text-sm text-gray-500 mb-4">Chat with our support team for immediate assistance</p>
              <Button className="bg-[#0172af] hover:bg-[#015d8c] w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Phone className="w-10 h-10 text-[#0172af] mb-4" />
              <h3 className="font-medium mb-2">Call Support</h3>
              <p className="text-sm text-gray-500 mb-4">Call our support team at +1-800-CARE-CONNECT</p>
              <Button className="bg-[#0172af] hover:bg-[#015d8c] w-full">Call Now</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Mail className="w-10 h-10 text-[#0172af] mb-4" />
              <h3 className="font-medium mb-2">Email Support</h3>
              <p className="text-sm text-gray-500 mb-4">Email our support team for detailed inquiries</p>
              <Button className="bg-[#0172af] hover:bg-[#015d8c] w-full">Send Email</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Tabs */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="account">Account & Settings</TabsTrigger>
            <TabsTrigger value="jobs">Jobs & Applications</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="posts">Posts & Content</TabsTrigger>
          </TabsList>

          {faqCategories.map((category, index) => (
            <TabsContent key={index} value={category.category.toLowerCase().split(" ")[0]}>
              <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${faqIndex}`}>
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>

        {/* Video Tutorials */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Getting Started with CareConnect</h3>
                <p className="text-sm text-gray-500">Learn the basics of using CareConnect</p>
              </CardContent>
            </Card>

            <Card>
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">How to Find and Apply for Jobs</h3>
                <p className="text-sm text-gray-500">Tips for finding the perfect medical job</p>
              </CardContent>
            </Card>

            <Card>
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Building Your Professional Network</h3>
                <p className="text-sm text-gray-500">Learn how to connect with other medical professionals</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-[#f0f7fa] p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Still Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Our support team is available 24/7 to assist you with any questions or issues
          </p>
          <Button className="bg-[#0172af] hover:bg-[#015d8c]">Contact Support</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

