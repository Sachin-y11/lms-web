"use client"

import { Editor, EditorStateSnapshot, useEditorState } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Toggle } from "../ui/toggle"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Redo2Icon,
  StrikethroughIcon,
  Undo2Icon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"

const menuBarStateSelector = (ctx: EditorStateSnapshot<Editor | null>) => ({
  isBold: ctx?.editor?.isActive("bold") ?? false,
  isItalic: ctx.editor?.isActive("italic") ?? false,
  isStrike: ctx.editor?.isActive("strike") ?? false,
  isHeading1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
  isHeading2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
  isHeading3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
  isBulletList: ctx.editor?.isActive("bulletList") ?? false,
  isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
  isLeft: ctx.editor?.isActive({ textAlign: "left" }) ?? false,
  isCenter: ctx.editor?.isActive({ textAlign: "center" }) ?? false,
  isRight: ctx.editor?.isActive({ textAlign: "right" }) ?? false,
  isJustify: ctx.editor?.isActive({ textAlign: "justify" }) ?? false,
  canUndo: ctx.editor?.can().chain().focus().undo().run(),
  canRedo: ctx.editor?.can().chain().focus().redo().run(),
})

export default function MenuBar({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({ editor, selector: menuBarStateSelector })

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-2xl border border-t-0 border-input bg-card p-2">
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  editorState?.isBold ? "bg-muted text-muted-foreground" : ""
                )}
              >
                <BoldIcon />
              </Toggle>
            }
          />
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  editorState?.isItalic ? "bg-muted text-muted-foreground" : ""
                )}
              >
                <ItalicIcon />
              </Toggle>
            }
          />
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  editorState?.isStrike ? "bg-muted text-muted-foreground" : ""
                )}
              >
                <StrikethroughIcon />
              </Toggle>
            }
          />
          <TooltipContent>Strike</TooltipContent>
        </Tooltip>

        <Separator
          orientation="vertical"
          className="h-6 data-vertical:self-auto"
        />

        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  editorState?.isHeading1
                    ? "bg-muted text-muted-foreground"
                    : ""
                )}
              >
                <Heading1Icon />
              </Toggle>
            }
          />
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  editorState?.isHeading2
                    ? "bg-muted text-muted-foreground"
                    : ""
                )}
              >
                <Heading2Icon />
              </Toggle>
            }
          />
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  editorState?.isHeading3
                    ? "bg-muted text-muted-foreground"
                    : ""
                )}
              >
                <Heading3Icon />
              </Toggle>
            }
          />
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Separator
          orientation="vertical"
          className="h-6 data-vertical:self-auto"
        />

        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  editorState?.isBulletList
                    ? "bg-muted text-muted-foreground"
                    : ""
                )}
              >
                <ListIcon />
              </Toggle>
            }
          />
          <TooltipContent>Buller List</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive("orderList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  editorState?.isOrderedList
                    ? "bg-muted text-muted-foreground"
                    : ""
                )}
              >
                <ListOrderedIcon />
              </Toggle>
            }
          />
          <TooltipContent>Ordered List</TooltipContent>
        </Tooltip>
      </div>

      <Separator
        orientation="vertical"
        className="h-6 data-vertical:self-auto"
      />

      <div className="flex flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={cn(
                  editorState?.isLeft ? "bg-muted text-muted-foreground" : ""
                )}
              >
                <AlignLeftIcon />
              </Toggle>
            }
          />
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={cn(
                  editorState?.isCenter ? "bg-muted text-muted-foreground" : ""
                )}
              >
                <AlignCenterIcon />
              </Toggle>
            }
          />
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={cn(
                  editorState?.isRight ? "bg-muted text-muted-foreground" : ""
                )}
              >
                <AlignRightIcon />
              </Toggle>
            }
          />
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                className={cn(
                  editorState?.isJustify ? "bg-muted text-muted-foreground" : ""
                )}
              >
                <AlignJustifyIcon />
              </Toggle>
            }
          />
          <TooltipContent>Align Justify</TooltipContent>
        </Tooltip>
      </div>

      <Separator
        orientation="vertical"
        className="h-6 data-vertical:self-auto"
      />

      <div className="flex flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                disabled={!editorState?.canUndo}
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo2Icon />
              </Button>
            }
          />
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                disabled={!editorState?.canRedo}
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo2Icon />
              </Button>
            }
          />
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
