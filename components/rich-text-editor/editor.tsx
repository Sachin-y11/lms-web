"use client"

import Heading from "@tiptap/extension-heading"
import TextAlign from "@tiptap/extension-text-align"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import MenuBar from "./MenuBar"

import { ControllerRenderProps } from "react-hook-form"

export function RichTextEditor({
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
    "description"
  >
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      // Document,
      // Paragraph,
      // Text,
      // Bold,
      // italic,
      // BulletList,
      // OrderedList,
      // Strike,
      // UndoRedo,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none dark:bg-input/30 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()))
    },

    content: field.value ? JSON.parse(field.value) : "<p>Hello World ✌️</p>",
    immediatelyRender: false,
  })

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-input dark:bg-input/30">
      <MenuBar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  )
}
