"use client"

import { useUploadThing } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"
import { ControllerRenderProps } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import RenderEmptyState, { RenderErrorState } from "./RenderState"

interface UploadedProps {
  id: string | null
  file: string | null | File
  uploading: boolean
  progress: number
  key?: string
  isDeleting: boolean
  error: boolean
  objectUrl?: string
  fileType: "image" | "video"
}

export default function Uploader({
  field,
}: {
  field: ControllerRenderProps<
    {
      title: string
      description: string
      fileKey: string
      price: number
      duration: number
      level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
      category:
        | "Developement"
        | "Business"
        | "Finance"
        | "IT & Software"
        | "Office productifyty"
        | "Personal Developement"
        | "Design"
        | "Marketting"
        | "Health & Fitness"
        | "Music"
        | "Teaching & Academics"
      smallDescription: string
      slug: string
      status: "DRAFT" | "PUBLISHED" | "ARCHIVE"
    },
    "fileKey"
  >
}) {
  const [fileState, setFileState] = useState<UploadedProps>({
    error: false,
    file: null,
    fileType: "image",
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    objectUrl: field.value,
  })

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadProgress: (progress) => {
      setFileState((prev) => ({ ...prev, progress }))
    },
  })

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        error: false,
        progress: 0,
      }))

      try {
        const response = await startUpload([file])
        const uploadedFile = response?.[0]

        if (!uploadedFile) {
          throw new Error("The file could not be uploaded")
        }

        field.onChange(uploadedFile.ufsUrl)
        setFileState({
          file: uploadedFile.ufsUrl,
          uploading: false,
          progress: 100,
          objectUrl: uploadedFile.ufsUrl,
          error: false,
          id: uploadedFile.key,
          isDeleting: false,
          fileType: "image",
        })
      } catch (error) {
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          error: true,
        }))

        toast.error(error instanceof Error ? error.message : "Upload failed")
      }
    },
    [field, startUpload]
  )

  function rejectedFile(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      )

      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      )

      if (fileSizeToBig) {
        toast.error("File size is too big, max is 4MB")
      }

      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1")
      }
    }
  }

  const onDrop = useCallback(
    async (acceptFiles: File[]) => {
      if (acceptFiles.length > 0) {
        await uploadFile(acceptFiles[0])
      }
    },
    [uploadFile]
  )

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 4 * 1024 * 1024,
    onDropRejected: rejectedFile,
  })

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative h-64 w-full rounded-2xl border-2 border-dashed transition-colors duration-200 ease-in-out",
        isDragActive
          ? "border-solid border-primary bg-primary/10"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex size-full items-center justify-center">
        <input {...getInputProps()} />

        {fileState.error ? (
          <RenderErrorState />
        ) : field.value ? (
          <div className="relative size-full p-2">
            <Image
              src={field.value}
              alt="Uploaded course image"
              fill
              unoptimized
              className="size-full rounded-xl object-contain"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              aria-label="Remove uploaded image"
              onClick={(event) => {
                event.stopPropagation()
                field.onChange("")
                setFileState({
                  error: false,
                  file: null,
                  fileType: "image",
                  id: null,
                  uploading: false,
                  progress: 0,
                  isDeleting: false,
                })
              }}
            >
              <XIcon />
            </Button>
          </div>
        ) : (
          <RenderEmptyState isDragActive={isDragActive} />
        )}

        {isUploading && (
          <div className="absolute inset-x-4 bottom-3 text-center text-xs text-muted-foreground">
            Uploading {Math.round(fileState.progress)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}
