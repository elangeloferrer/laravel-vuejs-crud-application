<template>
  <div
    class="bg-opacity-50 fixed inset-0 flex items-center justify-center"
    @keyup.esc="$emit('close-modal')"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <div class="flex justify-end gap-2">
        <button type="button" @click="$emit('close-modal')">
          <Icon icon="mdi:close" class="text-xl hover:text-gray-300"></Icon>
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Icon } from "@iconify/vue";
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["close-modal"],

  setup() {},
});
</script>
<style lang="scss" scoped></style>
