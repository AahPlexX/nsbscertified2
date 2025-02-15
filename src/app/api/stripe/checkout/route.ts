
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { paymentLinksMap } from "@config/paymentLinks";
import { prisma } from "@lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { courseId } = body;

    // Check for predefined payment link
    const paymentLink = paymentLinksMap[courseId];
    if (paymentLink) {
      return NextResponse.json({ url: paymentLink });
    }

    // Fetch course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, price: true }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
            },
            unit_amount: course.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/student/dashboard?payment=success&course=${courseId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/courseroute/coursedescription/${courseId}?payment=cancelled`,
      metadata: {
        courseId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
