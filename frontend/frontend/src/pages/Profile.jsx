import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Profile</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Name</h2>
          <p>{user.first_name} {user.last_name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Email</h2>
          <p>{user.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Phone Number</h2>
          <p>{user.phone_number}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Address</h2>
          <p>{user.address}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowProfile;