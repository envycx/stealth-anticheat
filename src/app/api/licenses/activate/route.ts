import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const activateSchema = z.object({
  licenseKey: z.string().regex(/^STLTH-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/),
  hwid: z.string().min(1),
  deviceName: z.string().min(1),
})

/**
 * POST /api/licenses/activate - Activate a license on a device
 * This would typically be called by the anti-cheat client application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = activateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { licenseKey, hwid, deviceName } = parsed.data

    // Find license
    const license = await prisma.license.findUnique({
      where: { licenseKey },
      include: {
        activations: {
          where: { isActive: true },
        },
      },
    })

    if (!license) {
      return NextResponse.json({ error: "Invalid license key" }, { status: 404 })
    }

    if (license.status !== "active") {
      return NextResponse.json({ error: "License is not active" }, { status: 400 })
    }

    // Check if already activated on this HWID
    const existingActivation = license.activations.find((a: { hwid: string }) => a.hwid === hwid)
    if (existingActivation) {
      // Update last seen
      await prisma.activation.update({
        where: { id: existingActivation.id },
        data: { lastSeenAt: new Date() },
      })

      return NextResponse.json({ success: true, activation: existingActivation })
    }

    // Check activation limit
    if (license.activations.length >= license.maxActivations) {
      return NextResponse.json(
        { error: "Maximum activations reached. Please deactivate a device first." },
        { status: 400 }
      )
    }

    // Create new activation
    const activation = await prisma.activation.create({
      data: {
        licenseId: license.id,
        hwid,
        deviceName,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: license.userId,
        type: "license_activated",
        description: `License activated on ${deviceName}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        metadata: { hwid, deviceName },
      },
    })

    return NextResponse.json({ success: true, activation })
  } catch (error) {
    console.error("License activation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
