import { PRICING_PLANS } from "./constants";
import { getDbConnection } from "./db";
import { getUserUploadCount } from "./summaries";

export async function getPriceId(email: string) {
    const sql = await getDbConnection();
    const query = await sql`SELECT price_id FROM users where email = ${email} AND status = 'active'`;
    return query?.[0]?.price_id || null;
}




export async function hasReachedUploadLimit(userId: string) {
    const uploadCount = await getUserUploadCount(userId);
    if(!uploadCount) throw new Error();
    const priceId = await getPriceId(userId);
    const plan = PRICING_PLANS.find((plan) => plan.priceId === priceId);
    const isPro = plan?.id === 'pro';
    const uploadLimit = isPro ? 1000 : 5;

    return {
        hasReachedLimit: uploadCount >= uploadLimit,
        uploadLimit
    }
}