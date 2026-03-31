"use client"
import React, { InputHTMLAttributes, ReactNode, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type InputWithIconProps = {
  icon: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon,
  className = "",
  type = "text",
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const handleTogglePassword = () => setShowPassword((show) => !show)

  return (
    <div className="flex w-full items-center gap-3 rounded-full border bg-background/20 px-4 py-3 ring-primary transition-shadow focus-within:ring-2">
      <span className="flex h-full items-center text-muted-foreground">
        {icon}
      </span>
      <input
        className={`w-full border-none bg-transparent text-base outline-none placeholder:text-muted-foreground ${className}`}
        type={inputType}
        {...inputProps}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          className="flex items-center px-2 text-muted-foreground outline-none"
          onClick={handleTogglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
}

export { InputWithIcon }
