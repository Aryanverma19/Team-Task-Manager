import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page notfound-page">
      <div className="card">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="button">Return to dashboard</Link>
      </div>
    </section>
  );
}
