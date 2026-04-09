import type { OutputData } from "@editorjs/editorjs"

export function normalizeEditorData(raw: unknown): OutputData {
  if (
    raw &&
    typeof raw === "object" &&
    "blocks" in raw &&
    Array.isArray((raw as OutputData).blocks)
  ) {
    return raw as OutputData
  }
  return { time: Date.now(), blocks: [] }
}

export type CanvasPersistPayload = {
  elements: unknown[]
  appState: Record<string, unknown>
}

export function normalizeCanvasData(raw: unknown): CanvasPersistPayload {
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>
    const elements = Array.isArray(o.elements) ? o.elements : []
    const appState =
      o.appState && typeof o.appState === "object" && o.appState !== null
        ? (o.appState as Record<string, unknown>)
        : {}
    return { elements, appState }
  }
  return { elements: [], appState: {} }
}
