<template>
  <nav class="center-align no-margin vertical">
    <button
      class="circle fill small"
      @click="toggleEdit"
      :aria-label="isEditing ? 'Save text' : 'Edit text'"
    >
      <i>{{ isEditing ? 'save' : 'edit' }}</i>
    </button>

    <h4 v-if="!isEditing">{{ modelValue }}</h4>
    <div class="field label border no-margin no-padding" v-else>
      <input v-model="editingValue" @keyup.enter="toggleEdit" type="text" ref="inputRef" />
      <label>Prefix sentence</label>
    </div>
  </nav>
</template>

<script setup>
import {ref, nextTick} from 'vue'

const modelValue = defineModel()

const isEditing = ref(false)
const editingValue = ref('')
const inputRef = ref(null)

const toggleEdit = async () => {
  if (isEditing.value) {
    modelValue.value = editingValue.value
    isEditing.value = false
  } else {
    editingValue.value = modelValue.value.trim()
    isEditing.value = true
    await nextTick()
    inputRef.value?.focus()
  }
}
</script>
