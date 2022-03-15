import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"


export default NextAuth({
    providers: [
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
              token.accessToken = account.access_token
            }
            return token
          },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            return session
            },
        async redirect({ url, baseUrl }) {
            if (url === baseUrl) {
                return Promise.resolve('/')
            }
            return Promise.resolve('/')
        }
    }
})

