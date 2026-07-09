import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/activity - Get user's activity feed
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    const activities = await prisma.activity.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.activity.count({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ activities, total })
  } catch (error) {
    console.error("Get activity error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
