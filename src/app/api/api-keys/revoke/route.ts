import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const revokeSchema = z.object({
  apiKeyId: z.string().cuid(),
})

/**
 * POST /api/api-keys/revoke - Revoke an API key
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = revokeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { apiKeyId } = parsed.data

    // Find and verify ownership
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    })

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    if (apiKey.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Revoke
    await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive: false },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "api_key_revoked",
        description: `API key revoked: ${apiKey.name}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Revoke API key error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
