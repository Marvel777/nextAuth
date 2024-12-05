import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomUser {
    id: string;
    name: string;
    username: string;
    password: string;
    email: string;
    role: "user" | "admin";
}

// Extend the JWT interface
declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: "user" | "admin";
        admin?: CustomUser;
        user?: CustomUser;
    }
}

// Extend the Session interface
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "user" | "admin";
            admin?: CustomUser;
            user?: CustomUser;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user: CustomUser = {
                    id: "1",
                    name: "John Doe",
                    username: "john",
                    password: "password123",
                    email: "johnDoe@gmail.com",
                    role: "user",
                };

                const admin: CustomUser = {
                    id: "admin1",
                    name: "Admin",
                    username: "admin",
                    password: "adminpass",
                    email: "admin@example.com",
                    role: "admin",
                };

                if (credentials?.username === user.username && credentials?.password === user.password) {
                    return user;
                }

                if (credentials?.username === admin.username && credentials?.password === admin.password) {
                    return admin;
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user && "role" in user) {
                const customUser = user as CustomUser; // Cast to CustomUser type
                token.id = customUser.id;
                token.role = customUser.role;

                if (customUser.role === "admin") {
                    token.admin = customUser;
                } else if (customUser.role === "user") {
                    token.user = customUser;
                }
            }
            return token;
        },
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
