import api from "./api";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return { token, user };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  const user = getCurrentUser();
  return user && user.user_id;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

export const requireAdmin = () => {
  if (!isAdmin()) {
    alert("Admin access required!");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
}