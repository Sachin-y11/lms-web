"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { tryCatch } from "@/hooks/try-catch"
import {
  courseCategories,
  courseSchema,
  CourseSchemaType,
  SelectCourseLevel,
  SelectCourseStatus,
} from "@/lib/zod-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, SparklesIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Controller, Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import slugify from "slugify"
import { RichTextEditor } from "@/components/rich-text-editor/editor"
import Uploader from "@/components/file-upload/Uploader"
import { AdminGetSignleType } from "@/app/data/admin/admin-get-course"
import { editCourse } from "../actions"

interface Props {
  data: AdminGetSignleType
}

export default function EditCourseForm({ data }: Props) {
  console.log("🚀 ~ EditCourseForm.tsx:47 ~ EditCourseForm ~ data:", data)
  const [pending, startTransition] = useTransition()

  const router = useRouter()

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema) as Resolver<
      z.infer<typeof courseSchema>
    >,
    defaultValues: {
      category: data.category as CourseSchemaType["category"],
      description: data.description,
      duration: data.duration,
      fileKey: data.fileKey,
      level: data.level,
      price: data.price,
      slug: data.slug,
      smallDescription: data.smallDescription,
      status: data.status,
      title: data.title,
    },
  })
  function onSubmit(values: z.infer<typeof courseSchema>) {
    console.log(values)
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editCourse(values, data.id)
      )

      if (error) {
        toast.error(error.message)
        return
      }

      if (result.status === "success") {
        toast.success(result.message)
        form.reset()
        router.push("/admin/courses")
      } else {
        toast.error(result.message)
      }
    })
  }

  function onInvalidSubmit() {
    const firstError = Object.values(form.formState.errors)[0]
    toast.error(firstError?.message ?? "Please complete the required fields.")
  }

  return (
    <form
      id="course-form"
      onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
      className="space-y-6"
    >
      <FieldGroup>
        {/* Title */}
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-title">Title</FieldLabel>
              <Input
                {...field}
                id="form-title"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. Next.js"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex items-end gap-4">
          {/* Slug */}

          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="form-slug"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. next-js"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="button"
            onClick={() => {
              const getValue = form.getValues("title")

              const slug = slugify(getValue)
              form.setValue("slug", slug, { shouldValidate: true })
            }}
          >
            <SparklesIcon />
            Slug
          </Button>
        </div>

        {/* Small Description */}
        <Controller
          name="smallDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-smallDescription">
                Small Description
              </FieldLabel>
              <Textarea
                {...field}
                id="form-smallDescription"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. Next.js is server side rendering framework."
                className="min-h-30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Detailed Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-description">
                Detailed Description
              </FieldLabel>

              <RichTextEditor field={field} />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* File Key */}
        <Controller
          name="fileKey"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-fileKey">File Key</FieldLabel>
              <Uploader field={field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Category */}
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-category">Category</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a category</SelectLabel>
                      {courseCategories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Level */}
          <Controller
            name="level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-level">Level</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a level</SelectLabel>
                      {SelectCourseLevel.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Duration */}
          <Controller
            control={form.control}
            name="duration"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-duration">Duration (hrs.)</FieldLabel>
                <Input
                  {...field}
                  id="form-duration"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. 4 hours"
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Price */}
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-price">Price ($)</FieldLabel>
                <Input
                  {...field}
                  id="form-price"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. $100"
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Status */}
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-status">Status</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a status</SelectLabel>
                    {SelectCourseStatus.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          Update Course
        </Button>
      </div>
    </form>
  )
}
