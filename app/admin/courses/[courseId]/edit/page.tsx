import { adminGetCourse } from "@/app/data/admin/admin-get-course"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditCourseForm from "./_components/EditCourseForm"
import CourseStructure from "./_components/CourseStructure"

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function page({ params }: PageProps) {
  const { courseId } = await params

  const data = await adminGetCourse(courseId)

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="">
        <h1 className="mb-8 text-3xl font-bold">
          Edit Course:{" "}
          <span className="text-primary underline">{data.title}</span>
        </h1>

        <Tabs defaultValue={"basic-info"}>
          <TabsList className={"grid w-full grid-cols-2"}>
            <TabsTrigger value={"basic-info"}>Basic Info</TabsTrigger>
            <TabsTrigger value={"course-structure"}>
              Course Structure
            </TabsTrigger>
          </TabsList>

          <TabsContent value={"basic-info"}>
            <Card>
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
                <CardDescription>
                  Provide basic information about the course
                </CardDescription>
              </CardHeader>

              <CardContent>
                <EditCourseForm data={data} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value={"course-structure"}>
            <Card>
              <CardHeader>
                <CardTitle>Course Structure</CardTitle>
                <CardDescription>
                  Here you can update your Course Structure
                </CardDescription>
              </CardHeader>

              <CardContent>
                <CourseStructure data={data} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
