<template>
  <div
    class="relative flex min-h-screen items-center justify-center bg-gray-900 p-2"
  >
    <!-- Login Box -->
    <div class="relative w-96 rounded-xl bg-gray-800 p-8 text-center shadow-lg">
      <h1 class="mb-6 text-3xl font-bold text-white">Login</h1>

      <div class="mb-4">
        <input
          v-model="input.username_or_email"
          type="text"
          placeholder="Username or Email"
          class="w-full border-b-2 border-gray-500 bg-transparent px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div class="mb-6">
        <input
          v-model="input.password"
          type="password"
          placeholder="Password"
          class="w-full border-b-2 border-gray-500 bg-transparent px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div class="mb-6 text-left text-white">
        <label>
          <input type="checkbox" v-model="input.remember" />
          Remember Me
        </label>
      </div>

      <button
        @click="login"
        class="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { authenticate } from "../../ts/api/users";

import { save as saveToStore } from "../../ts/local-storage";
import router from "../../ts/router";

import { ILoginCredentials } from "../../ts/models/ILoginCredentials";

export default defineComponent({
  setup() {
    const input = ref({
      username_or_email: "",
      password: "",
      remember: false,
    });

    const isValid = computed(() => {
      return Object.values(input.value).every(Boolean);
    });

    const login = async () => {
      const { username_or_email, password, remember } = input.value;

      const body: ILoginCredentials = {
        username_or_email,
        password,
        remember,
      };

      let response = await authenticate(body);

      if (response !== undefined && response.status === 401) {
      } else if (response !== undefined && response.status === 200) {
        saveToStore("logged", {
          username_or_email: response.data.data.user.username_or_email,
          role: response.data.data.user.role,
          access_token: response.data.data.token,
        });
        router.push({
          name: "dashboard",
        });
      }
    };
    return {
      input,
      isValid,
      login,
    };
  },
});
</script>
