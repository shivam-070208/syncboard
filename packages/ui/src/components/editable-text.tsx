import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Edit2, Check, X } from "lucide-react"

interface EditableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onUpdate: (newValue: string) => Promise<void>
  disabled?: boolean
}

export const EditableText = ({
  value,
  onUpdate,
  className,
  disabled = false,
  ...props
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(value)
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  React.useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation()
    if (editValue.trim() === value) {
      setIsEditing(false)
      return
    }

    if (editValue.trim().length === 0) {
      setEditValue(value)
      setIsEditing(false)
      return
    }

    try {
      setIsLoading(true)
      await onUpdate(editValue.trim())
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update:", error)
      setEditValue(value)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation()
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave(e)
    } else if (e.key === "Escape") {
      handleCancel(e)
    }
  }

  if (isEditing) {
    return React.createElement(
      "div",
      {
        className: cn("group relative inline-block", className),
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        ...props,
      },
      React.createElement("input", {
        ref: inputRef,
        type: "text",
        value: editValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setEditValue(e.target.value),
        onKeyDown: handleKeyDown,
        className: cn(
          "wobbly font-handwritten min-w-[200px] border-2 border-border bg-background px-3 py-1 text-base outline-none focus:ring-1 focus:ring-ring"
        ),
        disabled: isLoading,
      }),
      React.createElement(
        "div",
        { className: "absolute top-0 -right-12 flex gap-0.5" },
        React.createElement(
          "button",
          {
            onClick: (e: React.MouseEvent) => handleSave(e),
            disabled: isLoading,
            className:
              "transform rounded-sm p-1.5 text-green-600 transition-colors hover:scale-110 hover:bg-green-100 disabled:opacity-50",
            title: "Save",
            type: "button",
          },
          React.createElement(Check, { className: "h-3.5 w-3.5" })
        ),
        React.createElement(
          "button",
          {
            onClick: (e: React.MouseEvent) => handleCancel(e),
            disabled: isLoading,
            className:
              "transform rounded-sm p-1.5 text-red-600 transition-colors hover:scale-110 hover:bg-red-100 disabled:opacity-50",
            title: "Cancel",
            type: "button",
          },
          React.createElement(X, { className: "h-3.5 w-3.5" })
        )
      )
    )
  }

  return React.createElement(
    "div",
    {
      className: cn("group relative inline-block", className),
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
      ...props,
    },
    React.createElement(
      "span",
      {
        className:
          "font-handwritten cursor-pointer transition-opacity hover:opacity-75",
      },
      value
    ),
    !disabled &&
      React.createElement(
        "button",
        {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            setIsEditing(true)
          },
          className:
            "absolute top-1/2 -right-8 -translate-y-1/2 transform p-1.5 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-125 hover:text-foreground",
          title: "Edit",
          type: "button",
        },
        React.createElement(Edit2, { className: "h-3.5 w-3.5" })
      )
  )
}
