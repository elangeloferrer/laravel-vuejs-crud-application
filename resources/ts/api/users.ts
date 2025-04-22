import axios from "axios";

import { get as getFromStore } from "../local-storage";

import { ILoginCredentials } from "../models/ILoginCredentials";

export const authenticate = (creds: ILoginCredentials) => {
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const baseUrl = import.meta.env.VITE_API_URL;

  return axios
    .post(
      baseUrl + "/api/login",
      {
        username_or_email: creds.username_or_email,
        password: creds.password,
        remember: creds.remember,
      },
      {},
    )
    .then((response) => {
      return response.status === 200
        ? Promise.resolve(response)
        : Promise.reject();
    })
    .catch((error) => {
      if (error.message === "Network Error") return error.message;
      return error.response;
    });
};

export const refreshToken = () => {
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const baseUrl = import.meta.env.VITE_API_URL;

  const _refreshToken = getFromStore("refresh_token");

  // const _refreshToken = {
  //   refresh_token:
  //     "5XjM33I59TTKvXpJJXaOwQabCG7LAT0PWVkNQ7ZvkZVzDPQOXzb2keq3QWYNqyVO",
  // };

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
