import Axios from "axios";
const axiosClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (res: any) => res,
  (error: any) => Promise.reject(error?.response?.data ?? error),
);

axiosClient.interceptors.request.use(async (req: any) => req);

export default axiosClient;
