import "server-only"
import { requireAdmin } from "./require-admin"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export async function adminGetCourse(id: string) {
  await requireAdmin()

  const data = await prisma.course.findUnique({
    where: {
      id: id,
    },
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
      category: true,
      description: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lesson: {
            select: {
              id: true,
              title: true,
              position: true,
              thumbnailUrl: true,
              videoUrl: true,
            },
          },
        },
      },
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

export type AdminGetSignleType = Awaited<ReturnType<typeof adminGetCourse>>
