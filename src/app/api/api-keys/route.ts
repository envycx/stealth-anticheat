import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateApiKey } from "@/lib/crypto"
import { z } from "zod"

/**
 * GET /api/api-keys - Get user's API keys
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        keyPreview: true,
        environment: true,
        createdAt: true,
        lastUsedAt: true,
        isActive: true,
      },
    })

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error("Get API keys error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  environment: z.enum(["production", "sandbox"]),
})

/**
 * POST /api/api-keys - Create new API key
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createKeySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { name, environment } = parsed.data

    // Generate API key
    const { fullKey, keyHash, keyPreview } = generateApiKey(environment)

    // Store in database
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name,
        keyHash,
        keyPreview,
        environment,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "api_key_generated",
        description: `API key created: ${name}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    // Return the full key ONCE (it won't be retrievable again)
    return NextResponse.json({
      apiKey: {
        ...apiKey,
        fullKey, // This is the only time the full key is returned
      },
    })
  } catch (error) {
    console.error("Create API key error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
