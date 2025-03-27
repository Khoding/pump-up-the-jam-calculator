<template>
  <nav class="edit-prefix center-align no-margin">
    <p class="countdown-units" v-if="!isEditing">{{ modelValue }}</p>
    <div class="field label border no-margin no-padding" v-else>
      <input v-model="editingValue" @keyup.enter="toggleEdit" type="text" ref="inputRef" />
      <label>{{ label }}</label>
    </div>
    <button
      class="circle fill small"
      @click="toggleEdit"
      :aria-label="isEditing ? 'Save text' : 'Edit text'"
    >
      <i>{{ isEditing ? 'save' : 'edit' }}</i>
    </button>
  </nav>
</template>

<script setup>
import {ref, nextTick} from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Edit text',
  },
})

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

<style scoped>
.edit-prefix {
  flex-direction: column-reverse;
  gap: 0.5rem;
}

.edit-prefix .countdown-units {
  margin-block: 0;
}
</style>
