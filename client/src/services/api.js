const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("ttm_token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

export const login = (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
export const signup = (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
export const fetchProjects = () => request("/projects");
export const fetchProject = (id) => request(`/projects/${id}`);
export const createProject = (payload) => request("/projects", { method: "POST", body: JSON.stringify(payload) });
export const addProjectMember = (projectId, payload) => request(`/projects/${projectId}/members`, { method: "POST", body: JSON.stringify(payload) });
export const fetchTasks = () => request("/tasks");
export const createTask = (payload) => request("/tasks", { method: "POST", body: JSON.stringify(payload) });
export const updateTask = (taskId, payload) => request(`/tasks/${taskId}`, { method: "PUT", body: JSON.stringify(payload) });
