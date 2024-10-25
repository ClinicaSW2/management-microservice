import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { gql, GraphQLClient } from 'graphql-request';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
         
          name: "Credentials",

          credentials: {
            email: { label: "Nombre de usuario", type: "email", placeholder: "nombre de usuario" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {

            const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;

            const query = gql`
            mutation Login($email: String!, $password: String!) {
                login(request: { email: $email, password: $password }) {
                    token
                }
            }
            `;
            const variables = {
                email: credentials?.email,
                password: credentials?.password
            };
            const client = new GraphQLClient(endpoint, { method: "POST", "Content-Type": "application/json" });
            try {
                const response = await client.request(query, variables);
                return response;
            } catch (err) {
                return null;
            }
          }
        }),
      ],
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.accessToken = user.login?.token
          }
          return token;
        },
        async session({ session, token }) {
          session.accessToken = token.accessToken
          return session
        }
      },
      pages: {
        signIn: "/auth/signin",
      },
});

export { handler as GET, handler as POST };
