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
    <div className="auth-page">
      <div className="tabs">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => {
            setIsLogin(true);
            setError("");
            setSuccess("");
          }}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => {
            setIsLogin(false);
            setError("");
            setSuccess("");
          }}
        >
          Register
        </button>
      </div>

      <div className="form">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
}

export default AuthPage;

