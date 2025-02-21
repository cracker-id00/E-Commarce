import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";

const Login = () => {
  const { setUser } = useUser();
  const [phoneLogin, setLoginType] = useState("email"); // Default to email
  const [email, setEmail] = useState("");
  const [phone_no, setPhone_no] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = phoneLogin === "email" 
        ? { email, password } 
        : { phone_number: phone_no, password }; 

      const response = await axios.post("http://localhost:8000/api/login/", payload, { withCredentials: true });

      if (response.data.message === "OTP sent successfully") {
        setOtpSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = phoneLogin === "email" ? { email, otp } : { phone_number: phone_no, otp };
      const response = await axios.post("http://localhost:8000/api/verify_otp/", payload, { withCredentials: true });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);

      navigate("/");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("OTP verification error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')" }}></div>
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-r from-purple-200 via-purple-300 to-brown-200">
        <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h1>

          {/* Toggle Switch for Email/Phone Login */}
          {
            !otpSent ?(
              <div className="flex items-center justify-center mb-4">
              <span className={`mr-3 font-semibold ${phoneLogin === "email" ? "text-blue-600" : "text-gray-500"}`}>
                Email
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={phoneLogin === "phone"} 
                  onChange={() => setLoginType(phoneLogin === "email" ? "phone" : "email")}
                />
                <div className="w-14 h-7 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-all duration-300 relative">
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300
          ${phoneLogin === "phone" ? "translate-x-7" : "translate-x-0"}`}></div>
                </div>
              </label>
              <span className={`ml-3 font-semibold ${phoneLogin === "phone" ? "text-blue-600" : "text-gray-500"}`}>
                Phone
              </span>
            </div>
            ) : (
                <p>OTP Sent</p>
            )
          }
          

          {!otpSent ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              {phoneLogin === "email" && (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}

              {/* Phone Number Input */}
              {phoneLogin === "phone" && (
                <input
                  type="tel"
                  placeholder="Registered Phone No"
                  value={phone_no}
                  onChange={(e) => setPhone_no(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}

              {/* Password Input */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Login Button */}
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Login
              </button>

              {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* OTP Input */}
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Verify OTP Button */}
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Verify OTP
              </button>

              {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
