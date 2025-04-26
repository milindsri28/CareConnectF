"use client"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-[#f0f7fa] min-h-screen">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-4 mb-6">
            <Image src="/images/user-avatar.png" alt="User Avatar" width={60} height={60} className="rounded-full" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>

          <nav className="space-y-4">
            <Link href="/settings" className="flex items-center gap-3 p-3 text-[#0172af] font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Account preferences
            </Link>
            <Link href="/settings/security" className="flex items-center gap-3 p-3 text-gray-600 hover:text-[#0172af]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Sign in & Security
            </Link>
            <Link
              href="/settings/visibility"
              className="flex items-center gap-3 p-3 text-gray-600 hover:text-[#0172af]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Visibility
            </Link>
            <Link href="/settings/privacy" className="flex items-center gap-3 p-3 text-gray-600 hover:text-[#0172af]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Data Privacy
            </Link>
            <Link
              href="/settings/advertising"
              className="flex items-center gap-3 p-3 text-gray-600 hover:text-[#0172af]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
              Advertising Data
            </Link>
            <Link
              href="/settings/notifications"
              className="flex items-center gap-3 p-3 text-gray-600 hover:text-[#0172af]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Notifications
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Profile Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4">
                <Link href="/settings/profile" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Name, location & Industry</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
              <div className="border-b pb-4">
                <Link href="/settings/demographics" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Personal demographic information</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
              <div>
                <Link href="/settings/verifications" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Verifications</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* General Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4">
                <Link href="/settings/language" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Language</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
              <div className="border-b pb-4">
                <Link href="/settings/content-language" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Content language</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
              <div className="border-b pb-4">
                <Link href="/settings/autoplay" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Autoplay videos</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">On</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </div>
              <div className="border-b pb-4">
                <Link href="/settings/sound" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sound effects</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">On</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </div>
              <div className="border-b pb-4">
                <Link href="/settings/profile-photos" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Showing profile photos</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">All CareConnect members</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </div>
              <div className="border-b pb-4">
                <Link href="/settings/feed" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Feed preferences</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
              <div className="border-b pb-4">
                <Link href="/settings/people-viewed" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">People also viewed</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">On</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </div>
              <div>
                <Link href="/settings/unfollowed" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">People you unfollowed</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Syncing Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Syncing options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4">
                <Link href="/settings/calendar" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Syncing calendar</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
              <div>
                <Link href="/settings/contacts" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Syncing contacts</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4">
                <Link href="/settings/hibernate" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Hibernate Account</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
              <div>
                <Link href="/settings/close-account" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Close Account</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

