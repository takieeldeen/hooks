import axios, { endpoints } from "./axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface SessionData {
  // Define the structure based on your API response
  user?: {
    id: string;
    email: string;
    // Add other user fields as needed
  };
  // Add other fields as needed
}

export const login = async (data: LoginData) => {
  const response = await axios.post(endpoints.auth.login, data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await axios.post(endpoints.auth.register, data);
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(endpoints.auth.signout);
  return response.data;
};

export const getCurrentSession = async (): Promise<SessionData> => {
  const response = await axios.get(endpoints.auth.getSession, {
    withCredentials: true,
  });
  return response.data;
};
