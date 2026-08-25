"use client"

import { AdminGetSignleType } from "@/app/data/admin/admin-get-course"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  GripVerticalIcon,
  Trash2Icon,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { reorderChapter, reorderLessons } from "../actions"

interface sotableItemProps {
  id: string
  children: (listners: DraggableSyntheticListeners) => React.ReactNode
  className?: string
  data?: {
    type: "chapter" | "lesson"
    chapterId?: string
  }
}

export default function CourseStructure({
  data,
}: {
  data: AdminGetSignleType
}) {
  const initialItems =
    data.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lesson.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || []

  const [items, setItems] = useState(initialItems)

  function SortableItem({ children, id, className, data }: sotableItemProps) {
    const {
      attributes,
      isDragging,
      setNodeRef,
      transform,
      transition,
      listeners,
    } = useSortable({
      id: id,
      data: data,
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    )
  }

  const handleDragEvent = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeId = active.id
    const overId = over.id
    const activeType = active.data.current?.type as "chapter" | "lesson"
    const overType = over.data.current?.type as "chapter" | "lesson"

    const courseId = data.id

    if (activeType === "chapter") {
      let targetChapterId = null

      if (overType === "chapter") {
        targetChapterId = overId
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null
      }

      if (!targetChapterId) {
        toast.error("Invalid target chapter")
        return
      }

      const oldIndex = items.findIndex((item) => item.id === activeId)
      const newIndex = items.findIndex((item) => item.id === targetChapterId)

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Invalid index")
        return
      }

      const reorderLocalChapter = arrayMove(items, oldIndex, newIndex)

      const updatedChapterForState = reorderLocalChapter.map((item, index) => {
        return {
          ...item,
          order: index + 1,
        }
      })

      const previousItem = [...items]

      setItems(updatedChapterForState)

      if (courseId) {
        const chaptersToUpdate = updatedChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }))

        const reorderChapterPromise = () =>
          reorderChapter({
            chapters: chaptersToUpdate,
            courseId,
          })

        toast.promise(reorderChapterPromise(), {
          loading: "Reordering chapter...",
          success: (result) => {
            if (result.status === "success") return result.message
            throw new Error(result.message)
          },
          error: () => {
            setItems(previousItem)
            return "Failed to reorder"
          },
        })
      }
    }

    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId
      const overChapterId = over.data.current?.chapterId
      if (!chapterId || !overChapterId) {
        toast.error("Invalid target chapter")
        return
      }

      const chapterIndex = items.findIndex((item) => item.id === chapterId)

      if (chapterIndex === -1) {
        toast.error("Invalid index")
        return
      }

      const chapterToUpdate = items[chapterIndex]

      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      )
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      )

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Invalid index")
        return
      }

      const reorderLocalLesson = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      )

      const updatedLessonForState = reorderLocalLesson.map((item, index) => {
        return {
          ...item,
          order: index + 1,
        }
      })

      const newItems = [...items]

      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      }

      const previousItem = [...items]

      setItems(newItems)

      if (courseId) {
        const lessonToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }))

        const reorderLessonsPromise = reorderLessons({
          chapterId: chapterId,
          lessons: lessonToUpdate,
          courseId: courseId,
        })

        toast.promise(reorderLessonsPromise, {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.status === "success") return result.message
            throw new Error(result.message)
          },
          error: () => {
            setItems(previousItem)
            return "Failed to reorder"
          },
        })
      }

      return
    }
  }

  function toogleChapter(chapterId: string) {
    setItems(
      items.map((item) =>
        item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
      )
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEvent}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flow-row flex items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                data={{ type: "chapter" }}
                key={item.id}
                id={item.id}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toogleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between border-b border-border p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size={"icon"}
                            variant={"ghost"}
                            className="cursor-grab opacity-60 hover:opacity-100"
                            {...listeners}
                          >
                            <GripVerticalIcon className="size-4" />
                          </Button>
                          <CollapsibleTrigger
                            render={
                              <Button
                                size={"icon"}
                                variant={"ghost"}
                                className="flex items-center"
                              >
                                {item.isOpen ? (
                                  <ChevronDownIcon className="size-4" />
                                ) : (
                                  <ChevronRightIcon className="size-4" />
                                )}
                              </Button>
                            }
                          />

                          <p className="cursor-pointer pl-2 hover:text-primary">
                            {item.title}
                          </p>
                        </div>

                        <Button size={"icon"} variant={"ghost"}>
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>

                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonsListeners) => (
                                  <div className="flex items-center justify-between rounded-2xl p-2 hover:bg-accent">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        {...lessonsListeners}
                                      >
                                        <GripVerticalIcon className="size-4" />
                                      </Button>
                                      <FileTextIcon className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>

                                    <Button size={"icon"} variant={"ghost"}>
                                      <Trash2Icon className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <Button variant={"outline"} className="w-full">
                              Create New Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  )
}
