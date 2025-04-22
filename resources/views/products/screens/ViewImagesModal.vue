<template>
  <modal @close-modal="closeModal">
    <h2 class="mb-4 text-lg font-semibold">View Images</h2>

    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(image, index) in productImages"
        :key="index"
        class="overflow-hidden rounded-2xl shadow-md"
      >
        <img
          :src="image.url"
          alt="Product Image"
          class="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
    <div class="flex justify-end gap-2 pt-8">
      <button
        type="button"
        class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        @click="closeModal()"
      >
        Close
      </button>
    </div>
  </modal>
</template>

<script lang="ts">
import Modal from "../../../components/common/Modal.vue";

import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  components: {
    Modal,
  },

  props: {
    images_to_view: {
      type: Array,
      required: true,
    },
  },

  emits: ["close-modal", "handle-delete-product"],

  setup(props, context) {
    const productImages = ref(props.images_to_view);

    const closeModal = () => {
      context.emit("close-modal");
    };

    onMounted(() => {});

    return {
      productImages,
      closeModal,
    };
  },
});
</script>
<style lang=""></style>
