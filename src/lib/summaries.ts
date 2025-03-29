import { getDbConnection } from "./db";

export async function getSummaries(userId: string) {
    const sql = await getDbConnection();
    const summaries = await sql`SELECT * from pdf_summaries where user_id = ${userId} ORDER BY created_at DESC`;
    return summaries;
}


export async function getUserUploadCount(userId : string) {
    const sql = await getDbConnection();
    try {
        const [result] = await sql`SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id = ${userId}`;
        return result?.count || 0;
    } catch (error) {
        console.log('Error fetching user upload count', error);
    }
}