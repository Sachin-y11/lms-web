"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/lib/type"
import { courseSchema, CourseSchemaType } from "@/lib/zod-schema"

export async function createCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  console.log("createCourse", values)

  try {
    const validation = courseSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.issues[0].message,
      }
    }

    const session = await requireAdmin()

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id,
      },
    })

    return {
      status: "success",
      message: "Course created successfully",
    }
  } catch (error) {
    return {
      status: "error",
      message: `${error}`,
    }
  }
}
