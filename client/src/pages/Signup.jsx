import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/api.js";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await signup(form);
      localStorage.setItem("ttm_token", response.token);
      localStorage.setItem("ttm_user", JSON.stringify(response.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page auth-page">
      <div className="card">
        <h1>Signup</h1>
        {error && <p className="alert">{error}</p>}
        <form onSubmit={onSubmit}>
          <label>
            Name
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
<label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
          <label>
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <button type="submit" className="button">Signup</button>
        </form>
        <p>
          Already a member? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
