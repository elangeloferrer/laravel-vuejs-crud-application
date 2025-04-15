import axios from "axios";
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
