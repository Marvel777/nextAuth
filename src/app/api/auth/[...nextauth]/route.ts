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
                // Assign token details based on role
                token.id = user.id;
                token.role = user.role; // Differentiate based on role
                /*************  ✨ Codeium Command ⭐  *************/
                /**
                 * This callback is called after signing in. It receives the user object
                 * (as returned from `authorize`), as well as a JWT token with basic
                 * information about the user (id, name, email, etc.).
                 *
                 * This is where you can set custom fields on the JWT, such as the user's
                 * role (admin or regular user). This is passed to the session callback
                 * where you can use it to customize the session object.
                 *
                 * @param {object} token - The JWT token with basic user information
                 * @param {object} user - The user object as returned from `authorize`
                 * @returns {object} - The updated JWT token
                 */
                /******  e397413a-dbfb-4390-989c-521e809c4c06  *******/
            }
            return token;
        },
        async session({ session, token }: any) {
            // Include different session data based on role
            session.user.id = token.id;
            session.user.role = token.role; // Include the role in the session object

            if (session.user.role === "admin") {
                // Optionally, add specific admin data to session if needed
                session.user.isAdmin = true;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
