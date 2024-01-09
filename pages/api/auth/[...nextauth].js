import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { loginForm } from '../../../src/services/auth.service'


export default NextAuth({

    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            checks: "none",
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
            return token
        },
        async jwt({ token, user, account }) {
            if (user) {
                try {
                    const payload = {
                        identifier: "heyBuddy@btch.com",
                        password: "WhatAreYouLooking?IamTheBest",
                        auth: "google",
                        idToken: account.id_token,
                    }
                    const response = await loginForm(payload)
                    return Promise.resolve(response)
                } catch (error) {
                    return Promise.reject(error)
                }
            }
            return token;
        },
    },
    useSecureCookies: false,
    secret: process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY,
    //error pages
    pages: {
        signIn: '/auth',
        signOut: '/',
        error: '/auth?type=error',
    }
})