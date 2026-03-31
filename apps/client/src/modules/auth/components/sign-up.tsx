"use client"
import React, { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaArrowRight } from "react-icons/fa"
import { MdMail as MailIcon } from "react-icons/md"
import { MdLock as LockIcon } from "react-icons/md"
import { MdPerson as PersonIcon } from "react-icons/md"
import { InputWithIcon } from "@workspace/ui/components/input-with-icon"
import { useRouter, useSearchParams } from "next/navigation"
import { useSignup } from "@/modules/auth/hooks/use-auth"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

const signupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be at most 32 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(emailRegex, { message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(passwordRegex, {
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    }),
})

type SignupFormInputs = z.infer<typeof signupSchema>

const SignupForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutate: signup, isPending, isSuccess } = useSignup()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
    reset,
  } = form

  const onSubmit = async (data: SignupFormInputs) => {
    setServerError(null)
    signup(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          const redirect = searchParams.get("redirect") || "/"
          reset()
          router.push(redirect)
        },
        onError: (err) => {
          if (err && err.message) {
            setServerError(err.message)
            if (
              err.message.toLowerCase().includes("email") &&
              err.message.toLowerCase().includes("use")
            ) {
              setError("email", { type: "manual", message: err.message })
            }
          } else {
            setServerError("Signup failed. Please try again.")
          }
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="text-center text-sm text-red-500">{serverError}</div>
        )}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="name">Name</Label>
              <FormControl>
                <InputWithIcon
                  id="name"
                  type="text"
                  {...field}
                  disabled={isSubmitting || isPending}
                  autoComplete="name"
                  placeholder="Your Name"
                  icon={<PersonIcon size={20} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email">Email</Label>
              <FormControl>
                <InputWithIcon
                  id="email"
                  type="email"
                  {...field}
                  disabled={isSubmitting || isPending}
                  autoComplete="email"
                  placeholder="you@example.com"
                  icon={<MailIcon size={20} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password">Password</Label>
              <FormControl>
                <InputWithIcon
                  id="password"
                  type="password"
                  {...field}
                  disabled={isSubmitting || isPending}
                  autoComplete="new-password"
                  placeholder="Password"
                  icon={<LockIcon size={20} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="btn-glow w-full cursor-pointer rounded-full py-6 font-semibold"
          disabled={isSubmitting || isPending}
        >
          {isSubmitting || isPending ? "Signing up..." : "Sign Up"}{" "}
          <FaArrowRight />
        </Button>
      </form>
      {isSuccess && (
        <div className="mt-4 text-center text-sm text-green-600">
          Signup successful! Redirecting...
        </div>
      )}
    </Form>
  )
}

export default SignupForm
