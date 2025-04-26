"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { JobCard } from "@/components/job-card"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Job {
  _id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  type: string
  experience: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  postedBy: string
  createdAt: string
  updatedAt: string
  company?: {
    _id: string
    firstName: string
    lastName: string
    profileImage?: string
    role?: string
    hospital?: string
  }
}

interface CurrentUser {
  _id: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: string
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  // New job form state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [jobCompany, setJobCompany] = useState("")
  const [jobLocation, setJobLocation] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [jobType, setJobType] = useState("full-time")
  const [jobExperience, setJobExperience] = useState("entry")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs")
      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }
      const data = await response.json()
      setJobs(data.jobs)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load jobs. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/users/me")
      if (!response.ok) {
        throw new Error("Failed to fetch current user")
      }
      const data = await response.json()
      setCurrentUser(data)
    } catch (error) {
      console.error("Error fetching current user:", error)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
    fetchJobs()
  }, [])

  const handleSearch = () => {
    // In a real app, this would send the search parameters to the API
    toast({
      title: "Searching",
      description: `Searching for "${searchTerm}" in ${location || "all locations"}`,
    })
  }

  const handlePostJob = async () => {
    if (!jobTitle || !jobCompany || !jobLocation || !jobDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          company: jobCompany,
          location: jobLocation,
          description: jobDescription,
          type: jobType,
          experience: jobExperience,
          requirements: [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to post job")
      }

      toast({
        title: "Success",
        description: "Job posted successfully",
      })

      // Reset form
      setJobTitle("")
      setJobCompany("")
      setJobLocation("")
      setJobDescription("")
      setJobType("full-time")
      setJobExperience("entry")

      // Close dialog
      setIsDialogOpen(false)

      // Refresh jobs
      fetchJobs()
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout suppressHydrationWarning={true}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Find Your Dream Medical Job</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0172af] hover:bg-[#015d8c]">Post a Job</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>Fill in the details below to post a new job opening.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium">
                      Job Title *
                    </label>
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Neurologist"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobCompany" className="text-sm font-medium">
                      Company/Hospital *
                    </label>
                    <Input
                      id="jobCompany"
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}
                      placeholder="e.g. Apollo Hospital"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="jobLocation" className="text-sm font-medium">
                    Location *
                  </label>
                  <Input
                    id="jobLocation"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Delhi, India"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="jobType" className="text-sm font-medium">
                      Job Type
                    </label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobExperience" className="text-sm font-medium">
                      Experience Level
                    </label>
                    <Select value={jobExperience} onValueChange={setJobExperience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry level</SelectItem>
                        <SelectItem value="associate">Associate</SelectItem>
                        <SelectItem value="mid-senior">Mid-Senior level</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="jobDescription" className="text-sm font-medium">
                    Job Description *
                  </label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Describe the job responsibilities, qualifications, and other details..."
                    className="min-h-[150px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#0172af] hover:bg-[#015d8c]"
                  onClick={handlePostJob}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, skill, or company"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Location"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button className="bg-[#0172af] hover:bg-[#015d8c]" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
              <div>
                <h3 className="font-medium mb-2">Date Posted</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="past24h" />
                    <label htmlFor="past24h" className="text-sm">
                      Past 24 hours
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="past3days" />
                    <label htmlFor="past3days" className="text-sm">
                      Past 3 days
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pastWeek" />
                    <label htmlFor="pastWeek" className="text-sm">
                      Past week
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pastMonth" />
                    <label htmlFor="pastMonth" className="text-sm">
                      Past month
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Experience Level</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="internship" />
                    <label htmlFor="internship" className="text-sm">
                      Internship
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="entry" />
                    <label htmlFor="entry" className="text-sm">
                      Entry level
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="associate" />
                    <label htmlFor="associate" className="text-sm">
                      Associate
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mid-senior" />
                    <label htmlFor="mid-senior" className="text-sm">
                      Mid-Senior level
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="director" />
                    <label htmlFor="director" className="text-sm">
                      Director
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Job Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fullTime" />
                    <label htmlFor="fullTime" className="text-sm">
                      Full-time
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="partTime" />
                    <label htmlFor="partTime" className="text-sm">
                      Part-time
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="contract" />
                    <label htmlFor="contract" className="text-sm">
                      Contract
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temporary" />
                    <label htmlFor="temporary" className="text-sm">
                      Temporary
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="volunteer" />
                    <label htmlFor="volunteer" className="text-sm">
                      Volunteer
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <Button className="bg-[#0172af] hover:bg-[#015d8c]">Post a Job</Button>
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job._id}
                {...job}
                companyInfo={job.company?.firstName + " " + job.company?.lastName} // Ensure it's a string
                currentUserId={currentUser?._id || ""}
                onDelete={fetchJobs}
              />
            ))
          )}
        </div>

        {jobs.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              Show more jobs <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

