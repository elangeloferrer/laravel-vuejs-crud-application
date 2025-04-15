import axios, { Axios, AxiosError, AxiosResponse } from "axios";

import { authorize } from "../local-storage";
import { ILoginData } from "../models/ILoginData";

import { remove as removeFromStore } from "../local-storage";
import router from "../router";

axios.defaults.headers.common["Content-Type"] = "application/json";

const axiosInstance = axios.create();

const baseURL = import.meta.env.VITE_API_URL;

const api = (axios: Axios) => {
  // abort controller
  const controller = new AbortController();

  authorize("logged", (loginData: ILoginData) => {
    if (loginData) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginData.access_token;
      axios.defaults.baseURL = baseURL + "/api";
    }
  });

  const sleep = (miliseconds: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>((resolve) => {
      setTimeout(() => resolve(response), miliseconds);
    });

  return {
    get: <T>(url: string, config: any) =>
      axios
        .get<T>(url, {
          signal: controller.signal,
          ...config,
          params: config.params,
        })
        .then(sleep(100)),
    post: <T>(url: string, body: object) => axios.post<T>(url, body),
    put: <T>(url: string, body: object) =>
      axios.put<T>(url, body).then(sleep(100)),
    patch: <T>(url: string, body: object) => axios.patch<T>(url, body),
    delete: <T>(url: string) => axios.delete<T>(url),
  };
};

export default api(axiosInstance);
