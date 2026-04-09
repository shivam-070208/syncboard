"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"

const WorkspaceShareControl = () => {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (typeof window === "undefined") return
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleShare}>
      {copied ? "Link copied" : "Share"}
    </Button>
  )
}

export { WorkspaceShareControl }
