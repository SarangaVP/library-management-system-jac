import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      const endpoint = isLogin ? "/user/login" : "/user/register";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLogin(email);
          setError("");
        } else {
          setSuccess("Registration successful! Please login.");
          setIsLogin(true);
        }
      } else {
        setError(data.detail || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Tabs */}
        <div className="flex justify-around mb-6">
          <button
            className={`py-2 px-4 rounded-md ${
              isLogin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setIsLogin(true);
              setError("");
              setSuccess("");
            }}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 rounded-md ${
              !isLogin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setIsLogin(false);
              setError("");
              setSuccess("");
            }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="form">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isLogin ? "Login" : "Register"}
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAuth}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isLogin ? "Login" : "Register"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

