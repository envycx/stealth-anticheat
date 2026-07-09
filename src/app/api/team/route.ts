import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateLicenseKey } from "@/lib/crypto"
import { z } from "zod"

/**
 * GET /api/team - Get team members for user's license
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user's team license
    const license = await prisma.license.findFirst({
      where: {
        userId: session.user.id,
        seats: { gt: 1 },
      },
      include: {
        teamMembers: {
          orderBy: { invitedAt: "desc" },
        },
      },
    })

    if (!license) {
      return NextResponse.json({ error: "No team license found" }, { status: 404 })
    }

    return NextResponse.json({
      license: {
        id: license.id,
        tier: license.tier,
        seats: license.seats,
      },
      teamMembers: license.teamMembers,
    })
  } catch (error) {
    console.error("Get team error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const inviteSchema = z.object({
  email: z.string().email(),
  licenseId: z.string().cuid(),
})

/**
 * POST /api/team - Invite team member
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = inviteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { email, licenseId } = parsed.data

    // Verify license ownership and seats
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: {
        teamMembers: {
          where: { status: "active" },
        },
      },
    })

    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 })
    }

    if (license.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!license.seats || license.seats <= 1) {
      return NextResponse.json({ error: "License does not support team members" }, { status: 400 })
    }

    // Check if seats are available
    const usedSeats = license.teamMembers.length + 1 // +1 for owner
    if (usedSeats >= license.seats) {
      return NextResponse.json({ error: "No seats available" }, { status: 400 })
    }

    // Check if email already invited
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        licenseId,
        email,
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: "Email already invited" }, { status: 400 })
    }

    // Generate sub-license key
    const subLicenseKey = generateLicenseKey()

    // Create team member
    const teamMember = await prisma.teamMember.create({
      data: {
        licenseId,
        email,
        subLicenseKey,
        status: "pending",
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "team_member_added",
        description: `Invited team member: ${email}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    // TODO: Send invitation email to the team member

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error("Invite team member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
