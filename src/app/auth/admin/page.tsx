import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("Credentials", {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            setError("Invalid username or password");
        } else if (result?.role === "admin") {
            router.push("/admin-dashboard"); // Redirect to admin dashboard after successful login
        } else {
            router.push("/auth/user");
        }
    };

    return (
        <form onSubmit={ handleSubmit }>
            <input
                type="text"
                placeholder="Username"
                value={ username }
                onChange={ (e) => setUsername(e.target.value) }
            />
            <input
                type="password"
                placeholder="Password"
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
            />
            { error && <p>{ error }</p> }
            <button type="submit">Admin Login</button>
        </form>
    );
};

export default AdminLogin;
