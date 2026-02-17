const IS_SERVER = typeof window === "undefined";
const axiosModule = IS_SERVER
  ? await import("./axios-server")
  : await import("./axios-client");

const axios = axiosModule.default;

export const endpoints = {
  auth: {
    login: "/auth/sign-in/email",
    register: "/auth/sign-up/email",
    signout: "/auth/sign-out",
    getSession: "/auth/get-session",
    isAuthenticated: "/auth/ok",
  },
};

export default axios;
