import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/licenses - Get user's licenses
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const licenses = await prisma.license.findMany({
      where: { userId: session.user.id },
      include: {
        activations: {
          where: { isActive: true },
          orderBy: { lastSeenAt: "desc" },
        },
        teamMembers: true,
      },
      orderBy: { purchasedAt: "desc" },
    })

    return NextResponse.json({ licenses })
  } catch (error) {
    console.error("Get licenses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
