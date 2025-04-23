<template>
  <header class="mb-5 flex items-center justify-between">
    <p>
      <span class="font-regular text-xl text-gray-400"
        >Dashboards&nbsp;&nbsp;/&nbsp;</span
      >
      <span class="font-regular text-xl text-black"> &nbsp;Videos Link </span>
    </p>
  </header>

  <div class="space-y-4 p-6">
    <div class="space-x-2">
      <button
        v-for="(item, index) in videos"
        class="items-center gap-1 rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
        @click="setVideoUrl(item.path)"
      >
        {{ item.title }}
      </button>
    </div>

    <VideoPlayer :url="currentVideoUrl" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import VideoPlayer from "../../components/videos-link/VideoPlayer.vue";

export default defineComponent({
  components: {
    VideoPlayer,
  },

  setup() {
    const baseURL = import.meta.env.VITE_API_URL;
    const videos = ref([
      {
        path: "/videos/video_1.mp4",
        title: "Video 1",
      },
      {
        path: "/videos/video_2.mp4",
        title: "Video 2",
      },
      {
        path: "/videos/video_3.mp4",
        title: "Video 3",
      },
      {
        path: "/videos/video_4.mp4",
        title: "Video 4",
      },
    ]);

    const currentVideoUrl = ref("");

    const setVideoUrl = (path) => {
      currentVideoUrl.value = baseURL + path;
    };

    onMounted(() => {
      currentVideoUrl.value = baseURL + "/videos/video_1.mp4";
    });

    return {
      videos,
      currentVideoUrl,

      setVideoUrl,
    };
  },
});
</script>
