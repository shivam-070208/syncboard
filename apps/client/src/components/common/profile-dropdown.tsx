"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { FaUser, FaSignOutAlt } from "react-icons/fa"

type ProfileDropdownProps = {
  userName: string
  onLogout: () => void
}

export default function ProfileDropdown({
  userName,
  onLogout,
}: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-left text-sm dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <FaUser className="h-4 w-4" />
            <span className="truncate">{userName || "Account"}</span>
          </div>
          <span className="text-xs text-neutral-500">Profile</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem
          onSelect={onLogout}
          className="flex items-center gap-2"
        >
          <FaSignOutAlt className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
