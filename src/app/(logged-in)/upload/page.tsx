import BgGradient from "@/components/common/bg-gradient";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
import { hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export default async function UploadPage() {
  const user = await currentUser();

  if(!user?.id) {
    redirect('/sign-in')
  }
  const {hasReachedLimit} = await hasReachedUploadLimit(user.id);

  if(hasReachedLimit) {
    redirect('/dashboard');
  }
  return (
   <section className="min-h-screen">
        <BgGradient/>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="flex flex-col gap-4">
            <UploadHeader/>
            <UploadForm/>
            </div>
          
        </div>
   </section>
  )
}
