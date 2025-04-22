<template>
  <modal @close-modal="closeModal">
    <h2 class="mb-4 text-lg font-semibold">Delete Product</h2>

    <p>
      Are you sure you want to delete
      <span class="font-bold">{{ PRODUCT_NAME }}</span
      >?
    </p>

    <div class="flex justify-end gap-2 pt-8">
      <button
        type="button"
        class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        @click="closeModal()"
      >
        Cancel
      </button>
      <button
        class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        @click="handleDeleteProduct()"
      >
        DELETE
      </button>
    </div>
  </modal>
</template>

<script lang="ts">
import Modal from "../../../components/common/Modal.vue";

import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    Modal,
  },

  props: {
    PRODUCT_NAME: {
      type: String,
      required: true,
    },
  },

  emits: ["close-modal", "handle-delete-product"],

  setup(props, context) {
    const PRODUCT_NAME = ref(props.PRODUCT_NAME);

    const closeModal = () => {
      context.emit("close-modal");
    };

    const handleDeleteProduct = () => {
      context.emit("handle-delete-product");
    };

    return {
      PRODUCT_NAME,

      closeModal,
      handleDeleteProduct,
    };
  },
});
</script>
<style lang=""></style>
