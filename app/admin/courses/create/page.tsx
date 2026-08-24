"use client"

import Uploader from "@/components/file-upload/Uploader"
import { RichTextEditor } from "@/components/rich-text-editor/editor"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { cn } from "@/lib/utils"
import {
  courseCategories,
  courseSchema,
  SelectCourseLevel,
  SelectCourseStatus,
} from "@/lib/zod-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, Loader2Icon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { useTransition } from "react"
import { Controller, type Resolver, useForm } from "react-hook-form"
import slugify from "slugify"
import { toast } from "sonner"
import z from "zod"
import { createCourse } from "./actions"
import { useRouter } from "next/navigation"

export default function CourseCreatePage() {
  const [pending, startTransition] = useTransition()

  const router = useRouter()

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema) as Resolver<
      z.infer<typeof courseSchema>
    >,
    defaultValues: {
      category: "Business",
      description: "",
      duration: 0,
      fileKey: "",
      level: "BEGINNER",
      price: 0,
      slug: "",
      smallDescription: "",
      status: "DRAFT",
      title: "",
    },
  })
  function onSubmit(data: z.infer<typeof courseSchema>) {
    console.log(data)
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createCourse(data))

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
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/courses"
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <h1 className="text-2xl font-semibold">Create Course</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <FieldLabel htmlFor="form-duration">
                        Duration (hrs.)
                      </FieldLabel>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="reset"
                variant="outline"
                disabled={pending}
                onClick={() => form.reset()}
              >
                Reset
              </Button>

              <Button type="submit" disabled={pending}>
                {pending && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                Create Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
