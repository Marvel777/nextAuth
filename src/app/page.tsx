"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const { data: session } = useSession();
  const [adminData, setAdminData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      // Fetch admin data
      const fetchAdminData = async () => {
        const response = await fetch("/api/admin/data"); // Replace with your actual API endpoint
        const data = await response.json();
        setAdminData(data);
      };
      fetchAdminData();
    } else if (session?.user?.role === "user") {
      // Fetch user data
      const fetchUserData = async () => {
        const response = await fetch("/api/user/data"); // Replace with your actual API endpoint
        const data = await response.json();
        setUserData(data);
      };
      fetchUserData();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-5xl font-bold text-green-600">Please log in</h1>
      </div>
    );
  }

  const handleSignOut = () => {
    const callbackUrl = session?.user?.role === "admin"
      ? "/auth/signin/admin-login"  // Redirect to admin login after admin signs out
      : "/auth/signin/user-login";   // Redirect to user login after user signs out

    signOut({ callbackUrl });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-green-600">Hello, { session?.user?.name }!</h1>
      <p className="text-lg">Email: { session?.user?.email }</p>

      { session?.user?.role === "admin" ? (
        <div className="mt-4">
          <p className="mt-2 text-red-600 font-semibold">You are logged in as an Admin.</p>
          { adminData ? (
            <div>
              <h2 className="text-2xl mt-4">Admin Data</h2>
              <pre className="mt-2">{ JSON.stringify(adminData, null, 2) }</pre>
            </div>
          ) : (
            <p>Loading admin data...</p>
          ) }
        </div>
      ) : (
        <div className="mt-4">
          <p className="mt-2 text-blue-600 font-semibold">You are logged in as a User.</p>
          { userData ? (
            <div>
              <h2 className="text-2xl mt-4">User Data</h2>
              <pre className="mt-2">{ JSON.stringify(userData, null, 2) }</pre>
            </div>
          ) : (
            <p>Loading user data...</p>
          ) }
        </div>
      ) }

      <button
        onClick={ handleSignOut }
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
