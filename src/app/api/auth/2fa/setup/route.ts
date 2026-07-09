import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `Stealth Anti-Cheat (${session.user.email})`,
      issuer: "Stealth",
    })

    // Store the secret temporarily (will be confirmed after verification)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret.base32 },
    })

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
    })
  } catch (error) {
    console.error("2FA setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
