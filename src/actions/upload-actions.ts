'use server';

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";



interface PdfSummaryType {
    userId?: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string  
}

export async function generatePdfSummary(uploadResponse: any) {
    if(!uploadResponse) {
        return {
            success: false,
            message: 'File upload failed',
            data: null
        }
    }
    const {serverData: {userId, file: pdfUrl}} = uploadResponse[0];

    if(!pdfUrl) {
        return {
            success: false,
            message: 'File upload failed',
            data: null
        };
    }

    try {
        const pdftText = await fetchAndExtractPdfText(pdfUrl);
         let summary;
        try {
            summary = await generateSummaryFromOpenAI(pdftText);
            console.log({summary});
        } catch (error) {
            console.log({error})
            // call gemini
            if(error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
                try {
                  summary = await generateSummaryFromGemini(pdftText);
                } catch (geminiError) {
                console.error('Gemini API failed after OpenAI quote exceeded', geminiError);
                throw new Error('Failed to generate summary with available AI providers')
                }
            }
        }

     if(!summary) {
        return {
            success: false,
            message: 'Failed to generate summary',
            data: null
        }
     }
     const fileName = uploadResponse[0].name
     const formattedFileName  = formatFileNameAsTitle(fileName);
     return {
        success: true,
        message: 'Summary generated successfully',
        data: {
            summary,
            title: formattedFileName
        }
     }
    } catch (error) {
        return {
            success: false,
            message: 'File upload failed',
            data: null
        };  
    }
}


async function savePdfSummary({userId, fileUrl, summary, title, fileName}: {
    userId: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string
}){
    // sql inserting 
    try {
        const sql = await getDbConnection();
        await sql`INSERT INTO pdf_summaries (user_id, original_file_url, summary_text, title, file_name) 
                    VALUES (${userId},${fileUrl},${summary},${title},${fileName});`
        
            // Fetch the inserted row
        const result = await sql`
        SELECT * FROM pdf_summaries 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT 1;
    `;
    return result[0];
    } catch (error) {
      console.log('Error saving PDF summary', error);
      throw error;  
    }
}

export async function storePdfSummaryAction({
    fileUrl,
    summary,
    title,
    fileName
}: PdfSummaryType) {
    // user is logged in und has a userID
    // savePdfSummary
    // savePdfSummary()
    let savedPdfSummary;
    try {
        const {userId} = await auth();
        if(!userId) {
            return {
                success: false,
                message: 'User not found'
            }
        }
        savedPdfSummary = await savePdfSummary({
            userId,
            fileUrl,
            summary,
            title,
            fileName
        });

        if(!savePdfSummary) {
            return {
                success: false,
                message: 'Failed to save PDF summary, please try again'
            }
        }

      
        
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error saving PDF summary'
        }
    }

    // revalidaze our cache 
//    revalidatePath(`/summaries/${savedPdfSummary.id}`)
    return {
        success: true,
        message: 'PDF summary saved successfully',
        data : {
            id: savedPdfSummary.id
        }
    }
}


