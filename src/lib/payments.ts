import Stripe from "stripe";
import { getDbConnection } from "./db";

export async function handleCheckoutSessionCompleted({session,stripe}: {session: Stripe.Checkout.Session; stripe: Stripe}) {
    console.log('Checkout session completed', session)
    const customerId = session.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const priceId = session.line_items?.data[0]?.price?.id;

    if('email' in customer && priceId) {
        const {email, name } = customer;

        await createOrUpdateUser({
            email: session.customer_details?.email || '',
            fullName: name as string,
            customerId,
            priceId,
            status: 'active'
        });

        await insertPayment({
            session,
            priceId
        })
    }
   
}


async function createOrUpdateUser({
    email,
    fullName,
    customerId,
    priceId,
    status

}: {
    email: string;
    fullName: string;
    customerId: string;
    priceId: string;
    status: string;
}) {
    try {
        const sql = await getDbConnection();
        const user = await sql `SELECT * FROM users WHERE email=${email}`
        if(user.length === 0) {
            await sql`INSERT INTO users (email,full_name, customer_id, price_id, status) VALUES(${email}, ${fullName}, ${customerId}, ${priceId}, ${status})`
        }
    } catch (error) {
       console.log('Error creating or updating user', error) 
    }
}


async function insertPayment({
session,
priceId
}: {
    session: Stripe.Checkout.Session;
    priceId: string
}) {
    try {
     const sql = await getDbConnection();
     const {amount_total, id, customer_details, status} = session;
     await sql`INSERT INTO payments (amount, status, stripe_payment_id, price_id,user_email) VALUES (${amount_total}, ${status},${id}, ${priceId}, ${customer_details?.email})`;

    } catch (error) {
        console.log('Error creating payment', error)
    }
}

export const handleSubscriptionDeleted = async ({
    subscriptionId,
    stripe
}: {
    subscriptionId: string;
    stripe: Stripe
}) => {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const sql = await getDbConnection();

        await sql`UPDATE users SET status = 'cancelled' WHERE customer_id =${subscription.customer}`;

        
    } catch (error) {
        console.error('Error handling subscription deleted', error);
        throw error;
    }
}