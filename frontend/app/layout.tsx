import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable:"--font-poppins",
  weight: "400"
})


const polyamine = localFont({
  src: [{path:"../public/fonts/Polyamine.ttf"}],
  variable: '--font-polyamine'

})
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${polyamine.variable}  antialiased bg-hivewhite`}
      >
        {children}
      </body>
    </html>
  );
}
