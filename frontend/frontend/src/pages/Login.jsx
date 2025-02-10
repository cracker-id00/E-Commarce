import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Redirect after login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });

      // Store tokens in localStorage or cookies
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-r from-purple-200 via-purple-300 to-brown-200">
        <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Login
            </button>
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
