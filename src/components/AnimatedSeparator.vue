<template>
  <div class="w-full z-10 relative max-w-lg">
    <svg class="size-14 animated-boat text-base-700" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M5.75 7H1.327a.5.5 0 0 1-.384-.82l5-6A.5.5 0 0 1 6.41.007a.75.75 0 0 1 .84.745L7.249 9h6.25a.5.5 0 0 1 .468.676l-1.013 2.702A2.5 2.5 0 0 1 10.614 14H3.386a2.5 2.5 0 0 1-2.34-1.622L.031 9.676A.5.5 0 0 1 .5 9h5.25zm3.631-4.804a.5.5 0 0 0-.896.304v4a.5.5 0 0 0 .5.5h3.07a.5.5 0 0 0 .396-.804z" clip-rule="evenodd" /></svg>
    <div class="absolute bottom-0 w-full h-4">
      <svg
        class="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none">
        <path
          class="fill-primary"
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
/* Ensure the container hides the overflow */
.overflow-hidden {
  overflow: hidden;
}

.animated-boat {
  position: relative;
  left: 0px; /* Start off-screen to the left */
  animation: sail 20s cubic-bezier(0.37, 0, 0.63, 1) infinite;
}

/* The keyframes move the boat from left to right, flip it, then return */
@keyframes sail {
  0% {
    left: 0px;
    transform: scaleX(1);
  }
  50% {
    left: calc(100% - 3.5rem);
    transform: scaleX(1);
  }
  50.001% {
    transform: scaleX(-1);
  }
  100% {
    left: 0px;
    transform: scaleX(-1);
  }
}
</style>
