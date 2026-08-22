import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/register", { email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Não foi possível cadastrar. Email já pode estar em uso.");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Cadastro</h1>
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
        {success && <p style={{ color: "green" }}>Cadastrado! Redirecionando...</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Cadastrar
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Já tem conta? <Link to="/login">Fazer login</Link>
      </p>
    </div>
  );
}