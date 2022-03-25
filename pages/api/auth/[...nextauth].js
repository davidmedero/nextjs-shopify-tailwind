import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './lib/mongodb'


export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: process.env.EMAIL_SERVER_PORT,
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD
              }
            },
            from: process.env.EMAIL_FROM
          }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
              }
          })
        ],
    jwt: {
        encryption: true,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
              token?.accessToken = account?.access_token
            }
            return token
          },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider.
            session?.accessToken = token?.accessToken
            return session
            },
        async redirect({ url, baseUrl }) {
            if (url === baseUrl) {
                return Promise.resolve('/')
            }
            return Promise.resolve('/yourOrders')
        }
    }
})

