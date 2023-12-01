import "./globals.css";
import type { Metadata } from "next";
import { Inter, Rock_Salt } from "next/font/google";

import Navbar from "../components/Navbar";
import AuthProvider from "./Providers";
import Footer from "../components/Footer";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });
const rockSalt = Rock_Salt({weight: "400", display: "swap", variable: "--font-rocksalt", subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Island Adventures",
  description: "Website for information about Island Adventures",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
      </head>
      <body className={`${inter.className} ${rockSalt.variable} bg-neutral-50`}>
        <AuthProvider>
          <Navbar/>
          <Suspense fallback={<Loading/>}>
          {children}
          </Suspense>
        </AuthProvider>
        {/* <Footer/> */}
      </body>
    </html>
  );
}
