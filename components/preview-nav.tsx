import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PreviewNav() {
  return (
    <div className="bg-white p-4 border-b">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link href="/preview" className="text-[#0172af] text-xl font-bold">
          CareConnect Preview
        </Link>

        <div className="flex gap-2">
          <Link href="/preview">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <Link href="/preview/posts">
            <Button variant="ghost" size="sm">
              Posts
            </Button>
          </Link>
          <Link href="/preview/connections">
            <Button variant="ghost" size="sm">
              Connections
            </Button>
          </Link>
          <Link href="/preview/jobs">
            <Button variant="ghost" size="sm">
              Jobs
            </Button>
          </Link>
          <Link href="/preview/login">
            <Button className="bg-[#0172af]" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

