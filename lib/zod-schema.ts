import { Courselevel, CourseStatus } from "@/app/generated/prisma/enums"
import z from "zod"

export const courseCategories = [
  "Developement",
  "Business",
  "Finance",
  "IT & Software",
  "Office productifyty",
  "Personal Developement",
  "Design",
  "Marketting",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
] as const

export const SelectCourseStatus = ["DRAFT", "PUBLISHED", "ARCHIVE"] as const
export const SelectCourseLevel = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
] as const

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(100, "Title must be at most 100 characters long."),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long."),
  fileKey: z.string().min(1, "File key is required."),
  price: z.coerce.number().min(1, "Price must be at least 1."),
  duration: z.coerce
    .number()
    .min(1, "Duration must be at least 1.")
    .max(500, "Duration must be at most 500."),
  level: z.enum(Courselevel, "Please select a valid course level."),
  category: z.enum(courseCategories, "Category is required."),
  smallDescription: z
    .string()
    .min(3, "Short description must be at least 3 characters long.")
    .max(200, "Short description must be at most 200 characters long."),
  slug: z.string().min(3, "Slug must be at least 3 characters long."),
  status: z.enum(CourseStatus, "Please select a valid course status."),
})

export type CourseSchemaType = z.infer<typeof courseSchema>
