import { viewPaths } from "@better-auth-ui/core"
import { ensureSession } from "@better-auth-ui/react/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { Settings } from "@/components/auth/settings/settings"
import { auth } from "@/lib/auth"
import { getQueryClient } from "@/lib/query-client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params

  if (!Object.values(viewPaths.settings).includes(path)) {
    notFound()
  }

  const requestHeaders = await headers()
  const queryClient = getQueryClient()

  const session = await ensureSession(queryClient, auth, {
    headers: requestHeaders,
  })

  if (!session) {
    redirect(
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/settings/${path}`)}`
    )
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Link
        href="/"
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "sticky top-4 left-4 z-50 flex w-fit items-center gap-2"
        )}
      >
        <HomeIcon />
        Home
      </Link>
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <Settings path={path} />
      </div>
    </HydrationBoundary>
  )
}
