"use client";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "300", "400", "500", "700"],
});
import { Toaster } from "@/components/ui/toaster";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={`${notoSansThai.className} relative`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}
