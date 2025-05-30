<template>
  <header class="mb-5 flex items-center justify-between">
    <p>
      <span class="font-regular text-xl text-gray-400">
        Dashboards&nbsp;&nbsp;/&nbsp;
      </span>
      <span class="font-regular text-xl text-gray-400">
        Products&nbsp;&nbsp;/&nbsp;
      </span>
      <span class="font-regular text-xl text-black"> &nbsp;Edit Product </span>
    </p>
  </header>
  <div
    class="relative mx-auto my-10 flex h-full max-w-4xl items-center justify-center rounded-lg bg-white shadow-lg"
  >
    <div class="absolute top-0 right-0 flex w-full justify-between px-8 pt-4">
      <button
        @click="goBack"
        class="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
      >
        Back
      </button>
    </div>

    <div
      :class="[
        currentStep === 0 ? 'block' : 'hidden',
        '-mt-16 w-full space-y-4 p-4',
      ]"
    >
      <div>
        <label class="mb-1 block text-sm text-black">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <label class="mb-1 block text-sm text-black">Category</label>
        <select
          v-model="form.category"
          class="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option disabled value="">Select category</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <div>
        <label class="mb-1 block text-sm text-black">Description</label>
        <EditorContent
          v-model="form.description"
          @update-model-value="updateDescriptionValue"
          :updatedModelValue="form.description"
        />
      </div>
    </div>

    <div
      :class="[
        currentStep === 1 ? 'block' : 'hidden',
        '-mt-44 w-full space-y-4 p-4',
      ]"
    >
      <div class="bg-gray-100 p-4">
        <label
          for="file-input"
          class="mb-2 flex items-center justify-between font-medium"
        >
          <span>Choose files</span>
          <button
            @click="triggerFileInput"
            class="rounded-full bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-700"
          >
            Select
          </button>
        </label>
        <input
          id="file-input"
          ref="fileInputRef"
          type="file"
          multiple
          class="hidden"
          accept=".jpg,.jpeg,.png,.webp"
          @change="handleFileChange"
        />

        <div class="mb-4 flex flex-col">
          <div
            ref="dropZoneRef"
            :class="[
              isDragging === true
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-300 text-gray-400',
            ]"
            class="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed text-lg"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
          >
            <span>Drag and drop files here</span>
          </div>

          <div
            class="mt-2 text-sm font-medium text-gray-500"
            v-if="files.length"
          >
            {{ files.length }} file{{ files.length > 1 ? "s" : "" }} selected
          </div>

          <div class="mt-6 flex space-x-4 overflow-x-auto pb-2">
            <div
              v-for="(file, index) in files"
              :key="index"
              class="relative mx-2 mb-2"
            >
              <img
                :src="file.preview"
                class="h-32 w-32 rounded-lg object-cover"
                alt="Preview"
              />
              <button
                @click="removeFile(index)"
                class="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs text-white opacity-50 transition-opacity hover:opacity-100 focus:outline-none"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      :class="[
        currentStep === 2 ? 'block' : 'hidden',
        '-mt-16 w-full space-y-4 p-4',
      ]"
    >
      <div>
        <label class="mb-1 block text-sm text-black">Date</label>
        <input
          v-model="form.datetime"
          type="datetime-local"
          class="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>
    </div>

    <!-- Fixed Buttons -->
    <div class="absolute bottom-0 left-0 flex w-full justify-between px-8 pb-4">
      <button
        type="button"
        class="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:bg-gray-400 disabled:text-white"
        @click="prevStep"
        :disabled="currentStep === 0"
      >
        Previous
      </button>

      <!-- Step Indicator -->
      <div class="mt-8">
        <div class="flex items-center justify-center gap-4">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center gap-2"
          >
            <div
              :class="[
                'flex h-4 w-4 items-center justify-center rounded-full text-sm font-medium',
                currentStep === index
                  ? 'bg-blue-600 text-black'
                  : 'bg-gray-200 text-gray-600',
              ]"
            ></div>
            <div
              v-if="index < steps.length - 1"
              class="h-px w-6 bg-gray-300"
            ></div>
          </div>
        </div>
      </div>

      <button
        v-if="currentStep === steps.length - 1"
        @click="handleEditProduct"
        :disabled="isNextStepBtnDisabled"
        class="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:text-white"
      >
        Finish
      </button>
      <!-- currentStep === 1 && step2 === false -->
      <button
        v-else
        @click="nextStep"
        :disabled="isNextStepBtnDisabled"
        class="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:text-white"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted,
  watch,
  onBeforeUnmount,
  reactive,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { save as saveToStore } from "../../ts/local-storage";

import router from "../../ts/router";

import { deleteProductImage } from "../../ts/api/products";
import { editProduct } from "../../ts/api/products";

import EditorContent from "../../components/EditorContent.vue";

import { IProduct } from "../../ts/models/IProduct";

export default defineComponent({
  components: {
    EditorContent,
  },

  props: {
    productId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const _router = useRouter();

    const steps = ["1", "2", "3"];
    const step1 = ref(false);
    const step2 = ref(false);
    const step3 = ref(false);
    const currentStep = ref(0);

    const categories = [
      "Electronics",
      "Clothing and Apparel",
      "Home and Kitchen",
      "Health and Beauty",
      "Sports and Outdoors",
    ];

    const files = reactive([]);
    const fileInputRef = ref(null);
    const dropZoneRef = ref(null);
    const isDragging = ref(false);
    const deletedImageIds = ref([]);

    const form = ref({
      name: "",
      category: "",
      description: "",
      datetime: "",
      product_images: [],
    });

    const isNextStepBtnDisabled = computed(() => {
      if (currentStep.value === 0 && step1.value === false) {
        return true;
      } else if (currentStep.value === 1 && step2.value === false) {
        return true;
      } else if (currentStep.value === 2 && step3.value === false) {
        return true;
      }

      return false;
    });

    const product = computed(
      () => store.getters["productManagement/getProductToUpdate"],
    );

    const updateDescriptionValue = (modelValue) => {
      form.value.description = modelValue;
    };

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
      }
    };

    const nextStep = () => {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++;
      }
    };

    // Start: Upload Image Functions
    const triggerFileInput = () => {
      fileInputRef.value.click();
    };

    const handleFileChange = (event: Event) => {
      const selectedFiles = (event.target as HTMLInputElement).files;
      const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

      // Filter the valid image
      const validFiles = Array.from(selectedFiles).filter((file) =>
        acceptedTypes.includes(file.type),
      );

      displayImages(validFiles);
    };

    const handleDragOver = () => {
      console.log("handleDragOver");
      isDragging.value = true;
    };

    const handleDragLeave = () => {
      isDragging.value = false;
    };

    const handleDrop = (event) => {
      const droppedFiles = event.dataTransfer.files;
      displayImages(droppedFiles);
      isDragging.value = false;
    };

    const displayImages = (fileList) => {
      for (const file of fileList) {
        const preview = URL.createObjectURL(file);
        files.push({ file, preview, isExisting: false });
        form.value.product_images.push(file);
      }
    };

    const removeFile = async (index: number) => {
      const fileToRemove = files[index];

      if (fileToRemove.isExisting && fileToRemove.id) {
        deletedImageIds.value.push(fileToRemove.id);
        //  await deleteProductImage(fileToRemove.id)
      }

      // Remove from files, regardless of new or existing
      files.splice(index, 1);

      if (files.length === 0) {
        step2.value = false;
      }
    };

    const handleEditProduct = () => {
      const newImages = files.filter((img) => !img.isExisting);
      const newImageFiles = newImages.map((img) => img.file);

      let editedProductRecord: Partial<IProduct> = {
        name: form.value.name,
        category: form.value.category,
        description: form.value.description,
        datetime: form.value.datetime,
        new_images: newImageFiles,
        removed_image_ids: deletedImageIds.value,
      };

      editProduct(props.productId, editedProductRecord)
        .then((response: any) => {
          saveToStore("latest_notif", {
            type: "update_product_notif",
            is_triggered: false,
            message: response.message,
          });

          router.push({
            name: "products",
          });
        })
        .catch((error) => {
          console.log("error in updating product", error);
        });
    };
    // End: Upload Image Functions

    const getProductToUpdate = async () => {
      if (!product.value) {
        await store.dispatch("productManagement/setProductToUpdate", {
          productToUpdate: {
            id: props.productId,
          },
        });
      }
      form.value.name = product.value.name;
      form.value.category = product.value.category;
      form.value.description = product.value.description;
      form.value.datetime = product.value.datetime;
      form.value.product_images = product.value.product_images;

      // Add existing images to files array
      if (form.value.product_images?.length) {
        for (const image of form.value.product_images) {
          files.push({
            file: null,
            preview: image.url,
            isExisting: true,
            id: image.id,
          });
        }
      }
    };

    onMounted(() => {
      getProductToUpdate();
    });

    const goBack = () => {
      _router.back();
    };

    watch(
      () => [form.value.name, form.value.category, form.value.description],
      () => {
        if (
          currentStep.value == 0 &&
          (form.value.name === "" ||
            form.value.category === "" ||
            form.value.description === "" ||
            form.value.name === undefined ||
            form.value.category === undefined ||
            form.value.description === undefined)
        ) {
          step1.value = false;
          return;
        } else {
          step1.value = true;
        }
      },
    );

    watch(
      () => form.value.product_images,
      () => {
        if (
          currentStep.value == 1 &&
          (!form.value.product_images || form.value.product_images.length === 0)
        ) {
          step2.value = false;
          return;
        } else {
          step2.value = true;
        }
      },
      { deep: true },
    );

    watch(
      () => form.value.datetime,
      () => {
        if (
          currentStep.value == 2 &&
          (form.value.datetime === "" || form.value.datetime === undefined)
        ) {
          step3.value = false;
          return;
        } else {
          step3.value = true;
        }
      },
    );

    return {
      categories,
      steps,
      step1,
      step2,
      step3,
      currentStep,
      form,
      isNextStepBtnDisabled,

      files,
      fileInputRef,
      dropZoneRef,
      isDragging,

      triggerFileInput,
      handleFileChange,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeFile,
      updateDescriptionValue,

      goBack,
      prevStep,
      nextStep,
      handleEditProduct,
    };
  },
});
</script>
