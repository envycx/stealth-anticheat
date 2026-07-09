import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
})

const checkoutSchema = z.object({
  tier: z.enum(["usermode", "kernel"]),
  seats: z.number().int().min(1).optional(),
})

/**
 * POST /api/checkout/create-session - Create Stripe checkout session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { tier, seats } = parsed.data

    // Define pricing
    const prices = {
      usermode: 4900, // $49.00
      kernel: 9900, // $99.00
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: tier === "usermode" ? "Stealth Usermode License" : "Stealth Kernel License",
            description:
              tier === "usermode"
                ? "Ring-3 protection with memory scanning and heuristics"
                : "Ring-0 protection with driver-level detection and anti-tamper",
          },
          unit_amount: prices[tier],
        },
        quantity: 1,
      },
    ]

    // Add seats if team license
    if (seats && seats > 1) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Additional Team Seats",
            description: `${seats - 1} additional seats for your team`,
          },
          unit_amount: Math.floor(prices[tier] * 0.7), // 30% discount per additional seat
        },
        quantity: seats - 1,
      })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      metadata: {
        userId: session.user.id,
        tier,
        seats: seats?.toString() || "1",
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error) {
    console.error("Create checkout session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
