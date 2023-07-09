import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Inter } from "next/font/google";

import dbConnect from "@/db/database";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default async function RootLayout({ children, Session }) {
    await dbConnect();

    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning={true}>
                <AuthProvider session={Session}>{children} </AuthProvider>
            </body>
        </html>
    );
}
