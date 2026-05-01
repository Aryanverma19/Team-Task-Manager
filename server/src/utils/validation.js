export const validateSignup = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return "Name, email, and password are required.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (!email.includes("@")) {
    return "Email address is invalid.";
  }
  return null;
};

export const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required.";
  }
  return null;
};

export const validateProject = ({ name, description }) => {
  if (!name || !description) {
    return "Project name and description are required.";
  }
  return null;
};

export const validateTask = ({ title, description, projectId }) => {
  if (!title || !description || !projectId) {
    return "Task title, description, and project are required.";
  }
  return null;
};
