import type React from "react"
import Link from "next/link"
import Footer from "@/components/footer"

interface MainLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

export default function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white py-4 px-4 md:px-8 lg:px-16 border-b">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-[#0172af] text-2xl font-bold">
            Care Connect
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {showFooter && <Footer />}
    </div>
  )
}

