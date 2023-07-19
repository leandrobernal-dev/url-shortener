import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Inter } from "next/font/google";

import dbConnect from "@/db/database";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Url Shortener",
  description: "Generated by create next app",
};

export default async function RootLayout({ children, Session }) {
  await dbConnect();
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  return (
    <html
      lang="en"
      className={`${theme ? (theme.value !== "light" ? "dark" : "") : "dark"}`}
    >
      <body
        className={`${inter.className} dark:bg-primary`}
        suppressHydrationWarning={true}
      >
        <AuthProvider session={Session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
