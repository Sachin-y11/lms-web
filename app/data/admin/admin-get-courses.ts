import "server-only"

import prisma from "@/lib/prisma"
import { requireAdmin } from "./require-admin"

export const adminGetCourses = async () => {
  await requireAdmin()

  const data = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
    orderBy: {
      createAt: "desc",
    },
  })

  return data
}

export type AdminGetCoursesType = Awaited<ReturnType<typeof adminGetCourses>>[0]
