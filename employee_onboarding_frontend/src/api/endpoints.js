//
// Centralized API endpoint paths. Consumers should compose with baseURL from axios instance.
//
const endpoints = {
  auth: {
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    refresh: "/auth/refresh",
  },
  users: {
    root: "/users",
    byId: (id) => `/users/${id}`,
  },
  onboarding: {
    root: "/onboarding",
    forms: "/onboarding/forms",
    statuses: "/onboarding/statuses",
  },
  lessons: {
    root: "/lessons",
    assign: "/lessons/assign",
  },
  assignments: {
    root: "/assignments",
    byUser: (userId) => `/assignments/user/${userId}`,
  },
  documents: {
    root: "/documents",
    sign: "/documents/sign",
  },
  files: {
    root: "/files",
    upload: "/files/upload",
  },
  reports: {
    root: "/reports",
    progress: "/reports/progress",
  },
};

export default endpoints;
