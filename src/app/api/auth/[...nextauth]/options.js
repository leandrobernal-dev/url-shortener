import GoogleProvider from "next-auth/providers/google";
import GithubProvicer from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { NextAuthOptions } from "next-auth";

export const options = {
    providers: [
        GithubProvicer({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "text",
                    placeholder: "Your Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "*******",
                },
            },
            async authorize(credentials) {
                // retrieve user data here
                // https://next-auth.js.org/configuration/providers/credentials
                const user = {
                    id: 24,
                    email: "me@gmail.com",
                    password: "123",
                };
                console.log(credentials);

                if (
                    credentials.email === user.email &&
                    credentials.password === user.password
                ) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        // newUser: "/auth/register",
    },
};
