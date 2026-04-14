import AuthLayout from "@/modules/auth/components/auth-layout"
import LoginForm from "@/modules/auth/components/login"
import { Suspense } from "react"

export const metadata = {
  title: "Login | SyncBoard",
  description:
    "Login to SyncBoard and continue collaborating on live visual workspaces.",
}

const page = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <AuthLayout authType="login">
        <LoginForm />{" "}
      </AuthLayout>
    </Suspense>
  )
}

export default page
