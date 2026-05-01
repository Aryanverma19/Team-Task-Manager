import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await login(form);
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
        <h1>Login</h1>
        {error && <p className="alert">{error}</p>}
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
          <button type="submit" className="button">Login</button>
        </form>
        <p>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
