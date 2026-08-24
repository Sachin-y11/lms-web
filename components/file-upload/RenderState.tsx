import { cn } from "@/lib/utils"
import { CloudUploadIcon, ImageIcon } from "lucide-react"
import { Button } from "../ui/button"

export default function RenderEmptyState({
  isDragActive,
}: {
  isDragActive: boolean
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <br />
      <p className="text-base font-semibold text-foreground">
        Drop your files or{" "}
        <span className="cursor-pointer font-bold text-primary underline">
          browse
        </span>
      </p>
      <br />
      <Button type="button">Select File</Button>
    </div>
  )
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/30">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Something went wrong.
      </p>

      <p className="mt-3 text-xl text-muted-foreground">
        Click or drag file to upload
      </p>
    </div>
  )
}
