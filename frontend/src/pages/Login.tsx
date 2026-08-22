import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("token", response.data.access_token);
      navigate("/vagas");
    } catch (err) {
      setError("Email ou senha inválidos");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Entrar
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}