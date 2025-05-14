<template>
  <div>
    <video
      ref="videoRef"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      width="640"
      height="360"
    ></video>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, watch, ref } from "vue";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";

export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const videoRef = ref<HTMLVideoElement | null>(null);
    let player: Player;

    const setupPlayer = () => {
      if (videoRef.value) {
        if (player) {
          player.src({ type: "video/mp4", src: props.url });
          player.load();
          player.play();
        } else {
          player = videojs(videoRef.value, {
            controls: true,
            autoplay: false,
            preload: "auto",
            sources: [{ type: "video/mp4", src: props.url }],
          });
        }
      }
    };

    onMounted(() => {
      setupPlayer();
    });

    watch(
      () => props.url,
      () => {
        setupPlayer();
      },
    );

    onBeforeUnmount(() => {
      if (player) {
        player.dispose();
      }
    });

    return {
      videoRef,
    };
  },
});
</script>
