import { redirect } from "next/navigation"

export default function Page() {
  redirect("/dashboard/all")
  return null
}
