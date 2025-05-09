import type { Metadata } from "next";
import {Source_Sans_3 as FontSans} from 'next/font/google';
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"]
});



export const metadata: Metadata = {
  title: "Brevity – Because less is more",
  description: "Save hours of reading time. Transform lengthy PDFs into clear, accurate summaries in seconds with our advanced AI technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={` font-sans ${fontSans.variable}  antialiased `}
      >
        <div className="flex flex-col min-h-screen relative">
        <Header/>
        <main className="flex-1">
        {children}
        </main>
        <Footer/>
        </div>
       <Toaster position="top-right"/>
      </body>
    </html>
    </ClerkProvider>
  );
}
