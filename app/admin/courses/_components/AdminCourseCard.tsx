import { AdminGetCourseType } from "@/app/data/admin/admin-get-courses"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  ArrowRightIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  SchoolIcon,
  TimerIcon,
  TrashIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminCourseCard({
  data,
}: {
  data: AdminGetCourseType
}) {
  return (
    <Card className="group relative gap-0 py-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant={"secondary"} size={"icon"}>
                <MoreVerticalIcon className="size-4" />
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={
                <Link href={`/admin/courses/${data.id}/edit`}>
                  <PencilIcon />
                  Edit Course
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link href={`/courses/${data.id}`}>
                  <EyeIcon />
                  Preview
                </Link>
              }
            />
            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              render={
                <Link href={`/admin/courses/${data.id}/delete`}>
                  <TrashIcon />
                  Delete
                </Link>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={data.fileKey}
        alt="thumbnail Url"
        width={600}
        height={400}
        className="aspect-video h-full w-full rounded-t-2xl object-cover"
      />

      <CardContent className="pb-2">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="line-clamp-2 text-lg font-medium transition-colors group-hover:text-primary hover:underline"
        >
          {data.title}
        </Link>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 rounded-2xl bg-primary/10 p-1 text-primary" />
            <span className="text-sm text-muted-foreground">
              {data.duration}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <SchoolIcon className="size-6 rounded-2xl bg-primary/10 p-1 text-primary" />
            <span className="text-sm text-muted-foreground">{data.level}</span>
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={cn(
            buttonVariants({
              className: "mt-4 w-full",
            })
          )}
        >
          Edit course <ArrowRightIcon className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
