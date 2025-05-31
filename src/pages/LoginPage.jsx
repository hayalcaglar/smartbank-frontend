import { useState } from "react";
import api from "../services/api";
import SHA256 from "crypto-js/sha256";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const passwordHash = SHA256(password).toString();

      const response = await api.post("/Auth/login", {
        username,
        passwordHash: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/dashboard");
      // TODO: Dashboard'a yönlendir
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">SmartBank Login</h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
