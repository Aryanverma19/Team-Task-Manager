import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, fetchTasks, createProject } from "../services/api.js";

const getUser = () => JSON.parse(localStorage.getItem("ttm_user") || "null");

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const user = getUser();

  const loadData = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([fetchProjects(), fetchTasks()]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE");
  const statusCounts = tasks.reduce(
    (acc, task) => ({ ...acc, [task.status]: (acc[task.status] || 0) + 1 }),
    { TO_DO: 0, IN_PROGRESS: 0, DONE: 0 }
  );

  const handleAddProject = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createProject(newProject);
      setNewProject({ name: "", description: "" });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page dashboard-page">
      <div className="grid two-column">
        <div className="panel">
          <h1>Welcome, {user?.name || "Team Member"}</h1>
          <p>Role: {user?.role}</p>
          <div className="stats-card">
            <div>
              <h3>{tasks.length}</h3>
              <p>Total tasks</p>
            </div>
            <div>
              <h3>{projects.length}</h3>
              <p>Projects</p>
            </div>
            <div>
              <h3>{overdueTasks.length}</h3>
              <p>Overdue</p>
            </div>
          </div>
          <div className="status-card">
            <h2>Task status</h2>
            <ul>
              <li>To do: {statusCounts.TO_DO}</li>
              <li>In progress: {statusCounts.IN_PROGRESS}</li>
              <li>Done: {statusCounts.DONE}</li>
            </ul>
          </div>
          {error && <p className="alert">{error}</p>}
        </div>
        <div className="panel">
          <h2>Projects</h2>
          <ul className="item-list">
            {projects.map((project) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`}>{project.name}</Link>
                <span className="muted">{project.owner.name}</span>
              </li>
            ))}
          </ul>
          <div className="card project-form">
            <h3>Create project</h3>
            <form onSubmit={handleAddProject}>
              <label>
                Name
                <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required />
              </label>
              <label>
                Description
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} required />
              </label>
              <button className="button">Create Project</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
