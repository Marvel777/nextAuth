import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Simulated admin and user data (replace with actual database/API validation)
                const user = { id: "1", name: "John Doe", username: "john", password: "password123", email: "johnDoe@gmail.com", role: "user" };
                const admin = { id: "admin1", name: "Admin", username: "admin", password: "adminpass", email: "admin@example.com", role: "admin" };

                // Check if credentials match user or admin
                if (credentials?.username === user.username && credentials?.password === user.password) {
                    return user; // Return user object if authentication is successful
                }

                if (credentials?.username === admin.username && credentials?.password === admin.password) {
                    return admin; // Return admin object if authentication is successful
                }

                return null; // Return null if authentication fails
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin", // Redirect users to the default sign-in page
        error: "/auth/signin", // Redirect errors to the same sign-in page
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                // Store both user and admin data in the token
                token.id = user.id;
                token.role = user.role;

                if (user.role === "admin") {
                    // Store admin-specific data in the token if logged in as admin
                    token.admin = user;
                } else if (user.role === "user") {
                    // Store user-specific data in the token if logged in as user
                    token.user = user;
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            // Attach both user and admin data to the session
            session.user.id = token.id;
            session.user.role = token.role;

            if (token.admin) {
                session.user.admin = token.admin; // Store admin data in session if available
            }

            if (token.user) {
                session.user.user = token.user; // Store user data in session if available
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
