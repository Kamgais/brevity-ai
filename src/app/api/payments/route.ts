import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;
    const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
        event = stripe.webhooks.constructEvent(payload,signature!,endPointSecret);

        switch(event.type) {
            case 'checkout.session.completed':
                console.log("Checkout session completed")
                const sessionId = event.data.object.id;
                const session = await stripe.checkout.sessions.retrieve(sessionId,{
                    expand: ['line_items']
                })
                await handleCheckoutSessionCompleted({session,stripe})
                break;
            case 'customer.subscription.deleted':
                console.log("Customer subscription deleted")
                const subscription = event.data.object;
                console.log(subscription);
                const sessionIdDeleted = event.data.object.id;

                await handleSubscriptionDeleted({
                    subscriptionId: sessionIdDeleted,
                    stripe
                })
                break;
            default:
                console.log('Unhandled event type '+event.type)
        }
    } catch (err) {
        return NextResponse.json({
            error: 'Failed to trigger webhooks',
            err
        }, {
            status: 400
        })
    }
    return NextResponse.json({
        status: 'success'
    })
}


