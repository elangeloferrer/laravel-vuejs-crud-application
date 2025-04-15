<template>
  <router-view v-if="logged"></router-view>
  <login-view v-else></login-view>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import LoginView from "../views/user-screens/LoginView.vue";

import {
  get as getFromStore,
  load as loadFromStore,
} from "../ts/local-storage";

export default defineComponent({
  components: {
    LoginView,
  },

  setup() {
    const logged = computed(() => getFromStore("logged"));

    loadFromStore("logged");

    return {
      logged,
    };
  },
});
</script>
