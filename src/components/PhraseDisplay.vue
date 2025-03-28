<template>
  <section class="vertical">
    <EditableText v-model="prefixText" button-text="prefix sentence" />

    <nav class="center-align">
      <article class="primary-container auto-width">
        <h4 class="bold">{{ formattedTimeDifference }}</h4>
      </article>
    </nav>

    <h6>{{ isToday || (!isToday && timeDifferenceMs > 0 && !isSameDate) ? 'after' : 'before' }}</h6>

    <h4 v-for="line in suffixLines">{{ line }}</h4>
  </section>

  <nav class="center-align wrap">
    <button @click="editSuffix" class="small secondary">Edit suffix text</button>
    <button @click="copyText" @keyup.enter="copyText" class="small tertiary">Copy full text</button>
  </nav>

  <dialog ref="suffixDialog">
    <h3>Edit suffix text</h3>

    <main>
      <div class="field textarea label border">
        <textarea v-model="suffixTextEdit"></textarea>
        <label>Suffix text</label>
        <span class="helper">One line in editor equals one line in text</span>
      </div>
    </main>

    <nav>
      <button @click="saveSuffix" class="primary">Save</button>
      <button @click="cancelSuffix" class="error">Cancel</button>
      <button @click="resetToDefault" class="tertiary">Reset text</button>
    </nav>
  </dialog>
</template>

<script setup>
import {ref} from 'vue'
import EditableText from '@/components/EditableText.vue'

const props = defineProps({
  timeDifferenceMs: {
    type: Number,
    required: true,
  },
  formattedTimeDifference: {
    type: String,
    required: true,
  },
  isToday: {
    type: Boolean,
    default: false,
  },
  isSameDate: {
    type: Boolean,
    default: false,
  },
  isExtendedDate: {
    type: Boolean,
    default: false,
  },
})

const prefixText = ref(props.isToday ? 'Today is' : 'The chosen date is')

const defaultSuffixLines = ['the release of unrelated', 'Belgian Techno anthem', 'Pump Up The Jam']

const suffixLines = ref([...defaultSuffixLines])
const suffixDialog = ref(null)
const suffixTextEdit = ref('')

const editSuffix = () => {
  suffixTextEdit.value = suffixLines.value.join('\n')
  suffixDialog.value.showModal()
}

const saveSuffix = () => {
  const newLines = suffixTextEdit.value.split('\n').filter(line => line.trim())
  if (newLines.length > 0) {
    suffixLines.value = newLines
  }
  suffixDialog.value.close()
}

const cancelSuffix = () => {
  suffixDialog.value.close()
}

const resetToDefault = () => {
  suffixTextEdit.value = [...defaultSuffixLines].join('\n')
}

const copyText = () => {
  const compiledSuffix = suffixLines.value.join(' ')

  let textToCopy
  if (props.isSameDate) {
    textToCopy = `${props.isToday ? 'Today is' : prefixText.value} the same date as ${compiledSuffix}`
  } else {
    textToCopy = `${props.isToday ? 'Today is' : prefixText.value} ${props.formattedTimeDifference} ${props.isToday || (!props.isToday && props.timeDifferenceMs > 0) ? 'after' : 'before'} ${compiledSuffix}`
  }
  navigator.clipboard.writeText(textToCopy)
}
</script>
