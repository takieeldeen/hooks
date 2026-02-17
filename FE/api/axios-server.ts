"use server";
import Axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
const axiosServer = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosServer.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  (error: any) => Promise.reject(error?.response?.data ?? error),
);

axiosServer.interceptors.request.use(async (req: any) => {
  const userCookies = await cookies();
  const locale = userCookies.get("NEXT_LOCALE")?.value;
  const session = userCookies.get("better-auth.session_token")?.value;
  const token = userCookies.get("token")?.value;
  req.headers.Cookie = `token=${token}; better-auth.session_token=${session}`;
  //   req.headers.Cookie = `better-auth.session_token=${session}`;
  console.log(JSON.stringify(req.headers.Cookie));
  if (locale) {
    req.headers["Accept-Language"] = locale;
  }
  return req;
});

export default axiosServer;
