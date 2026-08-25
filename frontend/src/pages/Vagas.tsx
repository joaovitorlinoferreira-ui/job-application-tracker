import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  applied_date: string;
  job_url?: string;
  source?: string;
  notes?: string;
}

export default function Vagas() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("aplicado");
  const [appliedDate, setAppliedDate] = useState("");
  const navigate = useNavigate();

  async function loadApplications() {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (err) {
      navigate("/login");
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const httpBaseUrl = api.defaults.baseURL || "http://127.0.0.1:8000";
    const wsBaseUrl = httpBaseUrl.replace(/^http/, "ws");
    const socket = new WebSocket(`${wsBaseUrl}/ws?token=${token}`);

    socket.onmessage = () => {
      loadApplications();
    };

    socket.onerror = (err) => {
      console.error("Erro no WebSocket:", err);
    };

    return () => {
      socket.close();
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/applications", {
        company,
        role,
        status,
        applied_date: appliedDate,
      });
      setCompany("");
      setRole("");
      setStatus("aplicado");
      setAppliedDate("");
      loadApplications();
    } catch (err) {
      alert("Erro ao criar vaga");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deletar essa vaga?")) return;
    await api.delete(`/applications/${id}`);
    loadApplications();
  }

  async function handleStatusChange(id: number, newStatus: string) {
    await api.put(`/applications/${id}`, { status: newStatus });
    loadApplications();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Minhas Vagas</h1>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <form onSubmit={handleCreate} style={{ marginBottom: 24, border: "1px solid #ccc", padding: 16 }}>
        <h3>Nova vaga</h3>
        <input
          placeholder="Empresa"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          placeholder="Cargo"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }}>
          <option value="aplicado">Aplicado</option>
          <option value="em_analise">Em análise</option>
          <option value="entrevista">Entrevista</option>
          <option value="teste_tecnico">Teste técnico</option>
          <option value="oferta">Oferta</option>
          <option value="rejeitado">Rejeitado</option>
        </select>
        <input
          type="date"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Adicionar vaga
        </button>
      </form>

      <div>
        {applications.length === 0 && <p>Nenhuma vaga cadastrada ainda.</p>}
        {applications.map((app) => (
          <div key={app.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{app.company}</strong> — {app.role}
              <br />
              <small>Data: {app.applied_date}</small>
              <br />
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                style={{ marginTop: 4 }}
              >
                <option value="aplicado">Aplicado</option>
                <option value="em_analise">Em análise</option>
                <option value="entrevista">Entrevista</option>
                <option value="teste_tecnico">Teste técnico</option>
                <option value="oferta">Oferta</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
            <button onClick={() => handleDelete(app.id)}>Deletar</button>
          </div>
        ))}
      </div>
    </div>
  );
}