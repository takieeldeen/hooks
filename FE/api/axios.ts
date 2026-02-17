import Axios from "axios";
const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

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
