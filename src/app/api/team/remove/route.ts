import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const removeSchema = z.object({
  teamMemberId: z.string().cuid(),
})

/**
 * POST /api/team/remove - Remove team member
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = removeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { teamMemberId } = parsed.data

    // Find team member and verify ownership
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
      include: {
        license: true,
      },
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    if (teamMember.license.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update status to revoked (don't delete for audit trail)
    await prisma.teamMember.update({
      where: { id: teamMemberId },
      data: { status: "revoked" },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "team_member_removed",
        description: `Removed team member: ${teamMember.email}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Remove team member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
