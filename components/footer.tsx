import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white py-4 px-4 md:px-8 lg:px-16 border-t text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#666666]">
          <span className="font-medium text-[#0172af]">Care Connect</span>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/accessibility" className="hover:underline">
            Accessibility
          </Link>
          <Link href="/user-agreement" className="hover:underline">
            User Agreement
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/cookie-policy" className="hover:underline">
            Cookie Policy
          </Link>
          <Link href="/copyright-policy" className="hover:underline">
            Copyright Policy
          </Link>
          <Link href="/brand-policy" className="hover:underline">
            Brand Policy
          </Link>
          <Link href="/guest-controls" className="hover:underline">
            Guests Controls
          </Link>
          <Link href="/community-guidelines" className="hover:underline">
            Community Guidelines
          </Link>
        </div>
      </div>
    </footer>
  )
}

