<template>
  <div class="field label prefix border top-margin">
    <i>today</i>
    <input type="date" v-model="modelValue" />

    <label>Date</label>
  </div>
</template>

<script setup>
const modelValue = defineModel({
  type: String,
  required: true,
})
</script>
