"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/actions/auth-actions"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevent hydration mismatches

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const result = await loginUser(formData)

      if (result.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back to Care Connect!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0172af] to-[#34a353] flex flex-col">
      <header className="p-6">
        <Link href="/" className="text-white text-3xl font-bold">
          Care Connect
        </Link>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8">
        <div className="w-full max-w-md">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-white text-lg">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-white text-lg">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/30 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-white/80 text-sm hover:text-white">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#34a353] hover:bg-[#2a8442] text-white rounded-full py-6"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "GO!"}
            </Button>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-white data-[state=checked]:bg-[#34a353] data-[state=checked]:border-[#34a353]"
              />
              <label htmlFor="remember" className="text-white text-sm">
                Remember for 30 days
              </label>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-white/30 flex-1"></div>
              <span className="text-white text-sm">or</span>
              <div className="h-px bg-white/30 flex-1"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-[#545454] hover:bg-white/90 rounded-full flex items-center justify-center gap-2"
              onClick={() => router.push("/api/auth/google")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
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
              Sign in with Google
            </Button>
          </form>

          <div className="mt-8 text-center text-white">
            Haven&apos;t Registered yet?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="bg-white rounded-lg p-4 shadow-lg relative">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/telemedicine.png"
                alt="Medical professional with digital health tools"
                width={300}
                height={200}
                className="rounded"
                priority
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
      </main>
    </div>
  )
}
