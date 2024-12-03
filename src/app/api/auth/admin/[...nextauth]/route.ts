// app/api/auth/admin/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log('Admin credentials:', credentials);

                // Simulated admin data (replace this with actual database/API validation)
                const admin = {
                    id: "admin1",
                    name: "Admin User",
                    username: "admin",
                    password: "adminpass",
                    email: "admin@example.com",
                };

                // Check if the credentials match the admin data
                if (credentials?.username === admin.username && credentials?.password === admin.password) {
                    return admin; // Return admin object if authentication is successful
                } else {
                    return null; // Return null if authentication fails
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/admin/signin",
        error: "/auth/admin/signin", // Redirect errors to the admin sign-in page
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = "admin"; // Add a role field to identify admin users
            }
            return token;
        },
        async session({ session, token }: any) {
            session.user.id = token.id;
            session.user.role = token.role; // Pass the admin role to the session
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
