import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProject, createTask, addProjectMember, updateTask } from "../services/api.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", assigneeId: "" });
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");

  const loadProject = async () => {
    try {
      const data = await fetchProject(id);
      setProject(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createTask({
        ...newTask,
        projectId: id,
        assigneeId: newTask.assigneeId || null,
      });
      setNewTask({ title: "", description: "", dueDate: "", assigneeId: "" });
      loadProject();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await addProjectMember(id, { email: newMemberEmail });
      setNewMemberEmail("");
      loadProject();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async (taskId, status) => {
    setError("");
    try {
      await updateTask(taskId, { status });
      loadProject();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!project) {
    return <section className="page"><p>Loading project...</p></section>;
  }

  return (
    <section className="page project-page">
      <div className="panel">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <p className="meta">Owner: {project.owner.name}</p>
        <div className="card">
          <h2>Team members</h2>
          <ul className="member-list">
            {project.members.map((item) => (
              <li key={item.user.id}>{item.user.name} — {item.user.email}</li>
            ))}
          </ul>
          <form onSubmit={handleAddMember} className="inline-form">
            <input type="email" placeholder="Member email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} required />
            <button className="button button-small">Add member</button>
          </form>
        </div>
        {error && <p className="alert">{error}</p>}
      </div>
      <div className="panel">
        <div className="card">
          <h2>Tasks</h2>
          <ul className="task-list">
            {project.tasks.map((task) => (
              <li key={task.id} className={task.status.toLowerCase()}>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                  <small>{task.assignee ? `Assigned to ${task.assignee.name}` : "Unassigned"}</small>
                  <small>Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</small>
                </div>
                <div className="task-actions">
                  <select value={task.status} onChange={(e) => handleUpdateTask(task.id, e.target.value)}>
                    <option value="TO_DO">To do</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Add task</h2>
          <form onSubmit={handleCreateTask}>
            <label>
              Title
              <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
            </label>
            <label>
              Description
              <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} required />
            </label>
            <label>
              Assignee
              <select value={newTask.assigneeId} onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}>
                <option value="">Unassigned</option>
                {project.members.map((item) => (
                  <option key={item.user.id} value={item.user.id}>{item.user.name}</option>
                ))}
              </select>
            </label>
            <label>
              Due date
              <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
            </label>
            <button className="button">Create Task</button>
          </form>
        </div>
      </div>
    </section>
  );
}
