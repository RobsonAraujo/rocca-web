"use client"

import { SidePanel, lessonPanel } from "../components/side-panel"
import { HandleSheet, lessonSheet } from "../mobile/sheet"
import { LESSON_ID, conceptById, lesson } from "./data"
import { ConcentrationLesson } from "./lesson"

const concept = conceptById(LESSON_ID)
const description = `${lesson.eyebrow} · ${lesson.description}`

/**
 * The lesson's two containers, mounted once by the preview shell: a side
 * panel on tablets and desktop, a bottom sheet on phones. `openLesson()`
 * picks the right one. Each starts the lesson over when it opens.
 */
export function LessonLayer() {
  return (
    <>
      <SidePanel
        handle={lessonPanel}
        size="wide"
        title={concept.title}
        description={description}
      >
        <ConcentrationLesson />
      </SidePanel>
      <HandleSheet
        handle={lessonSheet}
        title={concept.title}
        description={description}
      >
        <ConcentrationLesson />
      </HandleSheet>
    </>
  )
}
