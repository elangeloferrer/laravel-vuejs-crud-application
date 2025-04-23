import {
  get as getFromStore,
  set as saveToStore,
  remove as removeFromStore,
} from "../../local-storage";

import { refreshToken } from "../users";

import router from "../../router";

let refreshPromise: Promise<boolean> | null = null;

export const handleUnauthorizedResponse = async () => {
  if (refreshPromise) {
    return await refreshPromise;
  }

  if (getFromStore("temp") && getFromStore("temp").isReauthenticating) return;

  saveToStore("temp", { isReauthenticating: true });

  refreshPromise = (async () => {
    let response = await refreshToken();

    console.log("response refresh token", response);

    if (response.status == 200) {
      saveToStore("logged", {
        username: response.data.data.user.username,
        role: response.data.data.user.role,
        access_token: response.data.data.access_token,
        refresh_token: response.data.data.refresh_token,
      });
      router.push({
        name: "products",
      });
    }

    if (response.status !== 200) {
      removeFromStore("logged");
      router.push("/");
    }

    saveToStore("temp", { isReauthenticating: false });
    refreshPromise = null;
    return response;
  })();

  return await refreshPromise;
};
