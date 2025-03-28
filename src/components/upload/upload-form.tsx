'use client';
import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner"
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";


const schema = z.object({
    file: z.instanceof(File, {message: 'Invalid file'})
    .refine((file) => file.size <= 20 * 1024 * 1024, {
        message: 'File size must be less than 20 MB'
    })
    .refine((file) => file.type.startsWith('application/pdf'), {
        message: 'File must be a PDF'
    })
})


export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
    const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
        onClientUploadComplete: () => {
          console.log("uploaded successfully!");
        },
        onUploadError: (error) => {
          console.log("error occurred while uploading", error);
          toast.error("Error occured while upload", {
            description: error.message
          });
        },
        onUploadBegin: ({ file }) => {
          console.log("upload has begun for", file);
        },
      });
    
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted');
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const file = formData.get('file') as File;

        // Validating the fields
        const validateFields = schema.safeParse({file});
        console.log(validateFields)

        if(!validateFields.success) {
            console.log(
                validateFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file'
            );
            toast.error("Something went wrong.", {
                description: validateFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file'
            });
            setLoading(false);
            return;
        }
        toast.info("Uploading PDF ℹ️", {
            description: 'We are uploading your PDF! 🔥'
        });

        // upload the file to uploadthing
        const resp = await startUpload([file]);
        if(!resp) {
            toast.error('Something went wrong', {
                description: 'Please use a different file'
            })
            setLoading(false);
            return;
        }
        toast.info("Processing PDF ℹ️", {
            description: 'Hang tight! Our AI is reading through your document! 🔥'
        });
    
        // parse the pdf using langchain
        const summary = await generatePdfSummary(resp);
        console.log({summary});
        const  {data = null, message = null} = summary || {};

        if(data) {
          let storeResult:any;
          toast.success('Saving PDF...',{
            description: 'Hang tight! We are saving your summary! 🔥'
          });
          formRef.current?.reset();

          if(data.summary) {
           storeResult = await storePdfSummaryAction({
              fileUrl: resp[0].ufsUrl,
              summary: data.summary,
              title: data.title,
              fileName: resp[0].name

            })

             // summarize the pdf using AI
          toast.success('🔥Summary Generated!',{
            description: 'Your summary has been saved!🔥'
          });
          setLoading(false);
          formRef.current?.reset();
          router.push(`/summaries/${storeResult.data.id}`)
          }
        }
       
        //TODO: redirect to the [id] summary page
    }
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
     <UploadFormInput onSubmit={handleSubmit} ref={formRef} isLoading={isLoading}/>
    </div>
  )
}
