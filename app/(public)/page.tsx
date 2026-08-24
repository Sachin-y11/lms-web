import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ChartColumnIcon,
  FilesIcon,
  GamepadDirectionalIcon,
  LucideIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"

const features: { title: string; description: string; icon: LucideIcon }[] = [
  {
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
    icon: FilesIcon,
    title: "Comrehensive Courses",
  },
  {
    description:
      "Engage with interactive content, quizzes, and assignment to enhance your learning experience.",
    icon: GamepadDirectionalIcon,
    title: "Interactive Learning",
  },
  {
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: ChartColumnIcon,
    title: "Progress Tracking",
  },
  {
    description:
      "Join a variant community of learners and instructors to collabrate and share knowledge.",
    icon: UsersIcon,
    title: "Progress Tracking",
  },
]

export default function Page() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Badge variant={"outline"}>The Future of Online Education</Badge>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Elevate you Learning Experience.
          </h1>
          <p className="max-w-175 text-muted-foreground md:text-xl">
            Dicover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/courses"
              className={cn(
                buttonVariants({
                  size: "lg",
                }),
                "capitalize"
              )}
            >
              explore Courses
            </Link>
            <Link
              href="/auth/sign"
              className={cn(
                buttonVariants({
                  size: "lg",
                  variant: "outline",
                }),
                "capitalize"
              )}
            >
              sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          return (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 text-4xl">{<feature.icon />}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </>
  )
}
