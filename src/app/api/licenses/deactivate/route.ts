import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const deactivateSchema = z.object({
  activationId: z.string().cuid(),
})

/**
 * POST /api/licenses/deactivate - Deactivate a device
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = deactivateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { activationId } = parsed.data

    // Find activation and verify ownership
    const activation = await prisma.activation.findUnique({
      where: { id: activationId },
      include: {
        license: true,
      },
    })

    if (!activation) {
      return NextResponse.json({ error: "Activation not found" }, { status: 404 })
    }

    if (activation.license.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Deactivate
    await prisma.activation.update({
      where: { id: activationId },
      data: { isActive: false },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "hwid_reset",
        description: `Device deactivated: ${activation.deviceName}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        metadata: { hwid: activation.hwid, deviceName: activation.deviceName },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("License deactivation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
