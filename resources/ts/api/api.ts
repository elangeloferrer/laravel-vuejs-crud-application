import axios, {
  Axios,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

import { authorize } from "../local-storage";
import { ILoginData } from "../models/ILoginData";

import { handleUnauthorizedResponse } from "./services/handleUnauthorizedResponse";

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

  // handle unauthorized request
  // possible reason session is expired
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.message === "Network Error" && !error.response) {
        console.log("Network error ===>", error);
        // show error notification here
      }
      if (error.response!.status === 401) {
        console.log("401 error ===>", error);

        handleUnauthorizedResponse();

        alert("Your session is going to be closed now, please login again!");
      } else {
        return Promise.reject(error);
      }
    },
  );

  const cancelRequests = () => {
    controller.abort();
  };

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
    post: <T>(url: string, body: object, config?: AxiosRequestConfig) =>
      axios.post<T>(url, body, config),
    put: <T>(url: string, body: object, config?: AxiosRequestConfig) =>
      axios.put<T>(url, body, config).then(sleep(100)),
    patch: <T>(url: string, body: object) => axios.patch<T>(url, body),
    delete: <T>(url: string) => axios.delete<T>(url),
    cancel: () => cancelRequests(),
  };
};

export default api(axiosInstance);
