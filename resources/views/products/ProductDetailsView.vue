<template>
  <header class="mb-5 flex items-center justify-between">
    <p>
      <span class="font-regular text-xl text-gray-400">
        Dashboards&nbsp;&nbsp;/&nbsp;
      </span>
      <span class="font-regular text-xl text-gray-400">
        Products&nbsp;&nbsp;/&nbsp;
      </span>
      <span class="font-regular text-xl text-black">
        &nbsp;Product Details
      </span>
    </p>
  </header>

  <div class="mx-auto max-w-7xl px-6 py-8">
    <div class="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
      <!-- Left column: Details -->
      <div>
        <h2 class="mb-2 text-2xl font-bold">{{ productInfo.name }}</h2>
        <p class="mb-1 text-gray-500">{{ productInfo.category }}</p>
        <p class="mb-2 text-gray-700">{{ productInfo.description }}</p>
        <p class="mb-4 text-sm text-gray-400">
          Date Added: {{ productInfo.datetime }}
        </p>

        <div class="flex justify-between">
          <div class="items-center">
            <button
              @click="goBack"
              class="flex items-center gap-1 rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <!-- Right column: Images -->
      <div class="flex flex-wrap gap-4">
        <img
          v-for="(image, index) in productInfo.product_images"
          :src="image.url"
          :key="index"
          class="h-48 w-48 object-cover transition-transform duration-300 hover:scale-105"
          alt="Product Image"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    productId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const productInfo = ref({
      name: "",
      category: "",
      description: "",
      datetime: "",
      product_images: [],
    });

    const product = computed(
      () => store.getters["productManagement/getProductToView"],
    );

    const getProductToView = async () => {
      if (!product.value) {
        await store.dispatch("productManagement/setProductToView", {
          productToView: {
            id: props.productId,
          },
        });
      }

      productInfo.value.name = product.value.name;
      productInfo.value.category = product.value.category;
      productInfo.value.description = product.value.description;
      productInfo.value.datetime = product.value.datetime;
      productInfo.value.product_images = product.value.product_images;
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      getProductToView();
    });

    return {
      productInfo,

      goBack,
    };
  },
});
</script>
