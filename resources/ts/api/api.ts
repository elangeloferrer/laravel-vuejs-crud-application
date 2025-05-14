import axios, {
  Axios,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

import { authorize } from "../local-storage";
import { ILoginData } from "../models/ILoginData";

import { handleUnauthorizedResponse } from "./services/handleUnauthorizedResponse";

import { showErrorToast } from "../utils/toast";

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
        showErrorToast("Network error. Please check your connection.");
        return Promise.reject("Network error. Please check your connection.");
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
    get: async <T>(
      url: string,
      config: any,
    ): Promise<{ response?: AxiosResponse<T>; error?: AxiosError }> => {
      try {
        const response = await axios.get<T>(url, {
          signal: controller.signal,
          ...config,
          params: config.params,
        });
        await sleep(100)(response);
        return { response };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },

    post: async <T>(
      url: string,
      body: object,
      config?: AxiosRequestConfig,
    ): Promise<{ response?: AxiosResponse<T>; error?: AxiosError }> => {
      try {
        const response = await axios.post<T>(url, body, config);
        return { response };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },

    put: async <T>(
      url: string,
      body: object,
    ): Promise<{ response?: AxiosResponse<T>; error?: AxiosError }> => {
      try {
        const response = await axios.put<T>(url, body);
        await sleep(100)(response);
        return { response };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },

    patch: async <T>(
      url: string,
      body: object,
    ): Promise<{ response?: AxiosResponse<T>; error?: AxiosError }> => {
      try {
        const response = await axios.patch<T>(url, body);
        return { response };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },

    delete: async <T>(
      url: string,
    ): Promise<{ response?: AxiosResponse<T>; error?: AxiosError }> => {
      try {
        const response = await axios.delete<T>(url);
        return { response };
      } catch (error) {
        return { error: error as AxiosError };
      }
    },

    cancel: () => cancelRequests(),
  };
};

export default api(axiosInstance);
