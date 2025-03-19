<template>
  <div class="field label prefix border top-margin">
    <i>today</i>
    <input type="date" :value="modelValue" @input="updateDate($event)" class="beer-date-input" />

    <label>Date</label>
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const updateDate = event => {
  emit('update:modelValue', event.target.value)
}
</script>
