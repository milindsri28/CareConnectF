import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layouts/main-layout"

export default function Home() {
  return (
    <MainLayout showFooter>
      {/* Hero section with gradient background */}
      <section className="bg-gradient-to-r from-[#0172af] to-[#34a353] text-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl md:text-2xl text-center mb-8">
                Identify the Appropriate Medical
                <br />
                Job or Internship for You
              </h2>

              {/* Login/Signup buttons */}
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-full p-1 flex mb-6">
                  <Link href="/login" className="flex-1 py-2 px-4 rounded-full text-[#0172af] font-medium text-center">
                    Login
                  </Link>
                  <Link href="/signup" className="flex-1 py-2 px-4 rounded-full text-[#0172af] font-medium text-center">
                    Sign up
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px bg-white/30 flex-1"></div>
                  <span className="text-sm">or</span>
                  <div className="h-px bg-white/30 flex-1"></div>
                </div>

                <Link
                  href="/api/auth/google"
                  className="w-full bg-white text-[#545454] rounded-full py-2 px-4 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-5 h-5"
                  >
                    <path
                      fill="#4280ef"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34a353"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#f6b704"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#e54335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Link>
              </div>
            </div>

            {/* Carousel section */}
            <div className="hidden md:block">
              <div className="bg-white rounded-lg p-4 shadow-lg relative">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/telemedicine.png"
                    alt="Medical professional with digital health tools"
                    width={300}
                    height={200}
                    className="rounded"
                  />
                </div>

                <div className="flex justify-center gap-1 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#0172af]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#d9d9d9]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#d9d9d9]"></div>
                </div>

                <button className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white/80 rounded-full">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white/80 rounded-full">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Searches section */}
      <section className="bg-gradient-to-r from-[#0172af] to-[#34a353] text-white py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Identify the
                <br />
                Appropriate Medical
                <br />
                Job or Internship for You
              </h2>
            </div>

            <div>
              <p className="text-sm mb-4">Suggested Searches</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Biomedical Engineering
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Business Development
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Health Services Manager
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Retail Associate
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Customer Care
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Operations
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Marketing
                </button>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                  Information Technology
                </button>
              </div>

              <button className="mt-4 bg-transparent border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm flex items-center">
                Show More <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Post a job section */}
      <section className="bg-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#545454] mb-4">
                Post a job for millions of
                <br />
                people to see
              </h2>
              <Button className="bg-white text-[#34a353] border border-[#34a353] hover:bg-[#34a353] hover:text-white rounded-full px-8">
                Post
              </Button>
            </div>
            <div className="flex justify-center">
              <Image src="/images/job-posting.png" alt="Job posting illustration" width={300} height={200} />
            </div>
          </div>
        </div>
      </section>

      {/* Connect with people section */}
      <section className="bg-gradient-to-r from-[#0172af] to-[#34a353] text-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <Image src="/images/connecting.png" alt="People connecting illustration" width={300} height={200} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Connect with people
                <br />
                who can help
              </h2>
              <Button className="bg-transparent border border-white hover:bg-white/10 rounded-full px-6">
                Find people you know
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Open to work section */}
      <section className="bg-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#545454] mb-4">
                Let the right people know
                <br />
                you are open to work
              </h2>
              <p className="text-[#666666] mb-4">
                With the Open To Work feature, you can privately tell hospitals or publicly share with the CareConnect
                community that you are looking for new job opportunities.
              </p>
            </div>
            <div className="flex justify-center">
              <Image src="/images/open-to-work.png" alt="Open to work illustration" width={300} height={200} />
            </div>
          </div>
        </div>
      </section>

      {/* Join section */}
      <section className="bg-gradient-to-r from-[#0172af] to-[#34a353] text-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Join your Colleagues, classmates and friends on
                <br />
                CareConnect
              </h2>
              <Link href="/signup">
                <Button className="bg-transparent border border-white hover:bg-white/10 rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <Image src="/images/colleagues.png" alt="Colleagues working together" width={300} height={200} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

