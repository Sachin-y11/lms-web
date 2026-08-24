import { betterAuth } from "better-auth"

import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import {
  admin,
  emailOTP,
  jwt,
  magicLink,
  openAPI,
  twoFactor,
  username,
} from "better-auth/plugins"
import { Resend } from "resend"
import { AuthEmailTemplate } from "@/components/emails/AuthEmails"
import prisma from "./prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    async sendResetPassword({ url, user }) {
      await resend.emails.send({
        from: "LMS <onboarding@resend.dev>",
        to: [user.email],
        subject: "Reset your password",
        react: AuthEmailTemplate({
          title: "Password Reset Request",
          previewText: "Reset your password",
          bodyText: "Click the button below to reset your account password:",
          actionText: "Reset Password",
          actionUrl: url,
        }),
      })
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ url, user }) {
      await resend.emails.send({
        from: "LMS <onboarding@resend.dev>",
        to: [user.email],
        subject: "Verify your email address",
        react: AuthEmailTemplate({
          title: "Welcome! Verify your email",
          previewText: "Verify your email address to complete registration",
          bodyText:
            "Thanks for signing up! Please verify your email by clicking below:",
          actionText: "Verify Email",
          actionUrl: url,
        }),
      })
    },
  },

  plugins: [
    twoFactor(),
    username(),
    jwt(),
    admin(),
    openAPI(),
    magicLink({
      async sendMagicLink({ email, url }) {
        await resend.emails.send({
          from: "LMS <onboarding@resend.dev>",
          to: [email],
          subject: "Your Magic Sign-In Link",
          react: AuthEmailTemplate({
            title: "Sign in with Magic Link",
            previewText: "Click to log in instantly",
            bodyText: "Click the link below to sign into your account:",
            actionText: "Sign In",
            actionUrl: url,
          }),
        })
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subjectMap = {
          "sign-in": "Your Sign-In Security Code",
          "email-verification": "Your Verification Code",
          "forget-password": "Your Password Reset Code",
          "change-email": "Your Email Change Code",
        }

        await resend.emails.send({
          from: "LMS <onboarding@resend.dev>",
          to: [email],
          subject: subjectMap[type] || "Your Security Code",
          react: AuthEmailTemplate({
            title: subjectMap[type] || "Security Code",
            previewText: `Your OTP is ${otp}`,
            bodyText: "Use the following code to complete your verification:",
            code: otp,
          }),
        })
      },
    }),
    nextCookies(),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})
