import { createAuthClient } from "better-auth/react"
import {
  adminClient,
  emailOTPClient,
  jwtClient,
  magicLinkClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    twoFactorClient(),
    magicLinkClient(),
    emailOTPClient(),
    adminClient(),
    jwtClient(),
  ],
})
