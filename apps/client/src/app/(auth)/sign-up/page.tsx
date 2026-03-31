import AuthLayout from "@/modules/auth/components/auth-layout"
import SignupForm from "@/modules/auth/components/sign-up"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <AuthLayout authType="signup">
        <SignupForm />
      </AuthLayout>
    </Suspense>
  )
}

export default page
