import AuthLayout from "@/modules/auth/components/auth-layout"
import LoginForm from "@/modules/auth/components/login"
import { Suspense } from "react"

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
