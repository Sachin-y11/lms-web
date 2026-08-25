"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/lib/type"
import { courseSchema, CourseSchemaType } from "@/lib/zod-schema"
import { revalidatePath } from "next/cache"

export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const user = await requireAdmin()

  try {
    const result = courseSchema.safeParse(data)
    if (!result.success) {
      return {
        status: "error",
        message: result.error.issues[0].message,
      }
    }

    await prisma.course.update({
      where: { id: courseId, userId: user.user.id },
      data: {
        ...result.data,
      },
    })

    return {
      status: "success",
      message: "Course updated successfully",
    }
  } catch (error) {
    return {
      status: "error",
      message: `${error}`,
    }
  }
}

export async function reorderLessons({
  chapterId,
  lessons,
  courseId,
}: {
  chapterId: string
  lessons: { id: string; position: number }[]
  courseId: string
}): Promise<ApiResponse> {
  await requireAdmin()

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons found",
      }
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    )

    await prisma.$transaction(updates)

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: "success",
      message: "Lessons reordered successfully",
    }
  } catch (error) {
    return {
      status: "error",
      message: `${error}`,
    }
  }
}

export async function reorderChapter({
  chapters,
  courseId,
}: {
  chapters: { id: string; position: number }[]
  courseId: string
}): Promise<ApiResponse> {
  await requireAdmin()
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided for reorderig.",
      }
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    )

    await prisma.$transaction(updates)

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      status: "success",
      message: "Chapter reordered successfully",
    }
  } catch (error) {
    return {
      status: "error",
      message: `${error}`,
    }
  }
}
