import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import speakeasy from "speakeasy"
import { z } from "zod"

const verifySchema = z.object({
  token: z.string().length(6),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = verifySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 })
    }

    const { token } = parsed.data

    // Get user's 2FA secret
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: "2FA not set up" }, { status: 400 })
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 steps before/after for clock drift
    })

    if (!verified) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Enable 2FA if not already enabled
    if (!user.twoFactorEnabled) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { twoFactorEnabled: true },
      })

      // Log 2FA enabled activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: "2fa_enabled",
          description: "Two-factor authentication enabled",
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
