"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"

import { AuthProvider } from "./auth/auth-provider"
import { Toaster } from "sonner"
import { TooltipProvider } from "./ui/tooltip"

import { authClient } from "@/lib/auth-client"
import { adminPlugin } from "@/lib/auth/admin-plugin"
import { deleteUserPlugin } from "@/lib/auth/delete-user-plugin"
import { emailOtpPlugin } from "@/lib/auth/email-otp-plugin"
import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin"
import { twoFactorPlugin } from "@/lib/auth/two-factor-plugin"
import { usernamePlugin } from "@/lib/auth/username-plugin"
import { getQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        redirectTo="/settings/account"
        socialProviders={["google"]}
        navigate={({ to, replace }) =>
          replace ? router.replace(to) : router.push(to)
        }
        plugins={[
          deleteUserPlugin(),
          adminPlugin(),
          emailOtpPlugin(),
          twoFactorPlugin(),
          usernamePlugin(),
          magicLinkPlugin(),
        ]}
        Link={Link}
      >
        <TooltipProvider>{children}</TooltipProvider>

        <Toaster richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  )
}
