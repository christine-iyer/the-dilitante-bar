import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user", // Default role for registration
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login request
        const response = await axios.post("http://127.0.0.1:8000/login/", {
          username: formData.username,
          password: formData.password,
        });
        setMessage(`Login successful! Token: ${response.data.access_token}`);
      } else {
        // Register request
        const response = await axios.post("http://127.0.0.1:8000/register/", formData);
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        {!isLogin && (
          <div style={{ marginBottom: "10px" }}>
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "5px" }}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: "10px", width: "100%", padding: "10px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "5px" }}
      >
        Switch to {isLogin ? "Register" : "Login"}
      </button>
      {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
    </div>
  );
};

export default AuthPage;