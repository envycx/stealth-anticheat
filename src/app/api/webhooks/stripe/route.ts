import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { generateLicenseKey } from "@/lib/crypto"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * POST /api/webhooks/stripe - Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Extract metadata
        const userId = session.metadata?.userId
        const tier = session.metadata?.tier as "usermode" | "kernel"
        const seats = parseInt(session.metadata?.seats || "1", 10)

        if (!userId || !tier) {
          console.error("Missing metadata in checkout session")
          break
        }

        // Generate license key
        const licenseKey = generateLicenseKey()

        // Create license in database
        const license = await prisma.license.create({
          data: {
            userId,
            tier,
            licenseKey,
            status: "active",
            maxActivations: 2,
            seats: seats > 1 ? seats : undefined,
            stripeSessionId: session.id,
          },
        })

        // Log activity
        await prisma.activity.create({
          data: {
            userId,
            type: "purchase",
            description: `Purchased ${tier} license${seats > 1 ? ` with ${seats} seats` : ""}`,
            ipAddress: "stripe-webhook",
            metadata: {
              licenseId: license.id,
              licenseKey: license.licenseKey,
              tier,
              seats,
            },
          },
        })

        console.log(`License created for user ${userId}: ${licenseKey}`)
        break
      }

      case "checkout.session.expired": {
        console.log("Checkout session expired:", event.data.object.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
