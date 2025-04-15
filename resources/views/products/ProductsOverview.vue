<template>
  <header class="mb-5 flex items-center justify-between">
    <p>
      <span class="font-regular text-xl text-gray-400"
        >Dashboards&nbsp;&nbsp;/&nbsp;</span
      >
      <span class="font-regular text-xl text-black"> &nbsp;Products </span>
    </p>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
  },
});
</script>
