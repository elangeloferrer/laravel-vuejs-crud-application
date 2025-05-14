import axios from "axios";

import { get as getFromStore } from "../local-storage";

import { showErrorToast } from "../utils/toast";

import { ILoginCredentials } from "../models/ILoginCredentials";

export const authenticate = async (creds: ILoginCredentials) => {
  try {
    axios.defaults.headers.common["Content-Type"] = "application/json";
    const baseUrl = import.meta.env.VITE_API_URL;

    const response = await axios.post(`${baseUrl}/api/login`, {
      username_or_email: creds.username_or_email,
      password: creds.password,
      remember: creds.remember,
    });

    if (response.status === 200 && response.data.success) {
      return response;
    } else {
      showErrorToast(response.data.message);
      return Promise.reject(response.data.message);
    }
  } catch (error: any) {
    if (error.message === "Network Error") {
      showErrorToast("Network error. Please check your connection.");
      return Promise.reject("Network error. Please check your connection.");
    }

    if (error.response.status == 401) {
      showErrorToast(
        error.response.data.error || "Login failed. Please try again.",
      );
      return Promise.reject("Login failed. Please try again.");
    }

    showErrorToast(error.message);
    return Promise.reject(error.message);
  }
};

export const refreshToken = () => {
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const baseUrl = import.meta.env.VITE_API_URL;

  const _refreshToken = getFromStore("refresh_token");

  return axios
    .post(baseUrl + "/api/refresh-token", _refreshToken, {})
    .then((response) => {
      return response.status === 200
        ? Promise.resolve(response)
        : Promise.reject();
    })
    .catch((error) => {
      return error.response;
    });
};
