import { adminGetCourses } from "@/app/data/admin/admin-get-courses"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import AdminCourseCard from "./_components/AdminCourseCard"

export default async function page() {
  const data = await adminGetCourses()

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link
          href="/admin/courses/create"
          className={cn(buttonVariants({}), "capitalize")}
        >
          create course
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {data.map((course) => {
          return <AdminCourseCard key={course.id} data={course} />
        })}
      </div>
    </div>
  )
}
