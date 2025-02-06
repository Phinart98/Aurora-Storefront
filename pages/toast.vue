<template>
  <div class="flex justify-center space-x-4 h-10">
    <button @click="$successToast('Operation was successful!')" class="bg-green-500 text-white px-4 py-2">
      Success
    </button>
    <button @click="$failToast('Something went wrong!')" class="bg-red-800 text-white px-4 py-2">
      Fail
    </button>
    <button @click="$warnToast('This is a warning!')" class="bg-orange-400 text-white px-4 py-2">
      Warn
    </button>
  </div>
</template>

<script setup>
const { $successToast, $failToast, $warnToast } = useNuxtApp()
</script>
