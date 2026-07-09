import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { z } from "zod"

const disableSchema = z.object({
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = disableSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    const { password } = parsed.data

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true, twoFactorEnabled: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify password
    const passwordsMatch = await compare(password, user.passwordHash)

    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    // Log 2FA disabled activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "2fa_disabled",
        description: "Two-factor authentication disabled",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("2FA disable error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
