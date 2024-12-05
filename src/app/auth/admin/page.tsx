'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminSignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false, // Prevent automatic redirect on failure
            username,
            password,
        });

        if (result?.error) {
            setError("Invalid username or password");
        } else if (result?.user?.role === 'admin') {
            // Check if the user has the admin role
            router.push("/admin/dashboard"); // Redirect to the admin dashboard
        } else {
            // For non-admin users, redirect to a default user page
            router.push("/"); // Or any other route for regular users
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={ handleSubmit } className="flex flex-col gap-4">
                <label>
                    Username
                    <input
                        name="username"
                        type="text"
                        value={ username }
                        onChange={ (e) => setUsername(e.target.value) }
                        required
                        className="border p-2"
                    />
                </label>
                <label>
                    Password
                    <input
                        name="password"
                        type="password"
                        value={ password }
                        onChange={ (e) => setPassword(e.target.value) }
                        required
                        className="border p-2"
                    />
                </label>
                { error && <p className="text-red-500">{ error }</p> }
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    Sign in
                </button>
            </form>
        </div>
    );
};

export default AdminSignIn;
