<template>
  <section class="vertical">
    <EditableText v-model="prefixText" button-text="prefix sentence" />

    <nav class="center-align">
      <article class="primary-container auto-width">
        <h4 class="bold">{{ formattedTimeDifference }}</h4>
      </article>
    </nav>

    <h6 v-if="isToday || (!isToday && timeDifferenceMs > 0 && !isSameDate)">after</h6>
    <h6 v-else-if="!isSameDate">before</h6>

    <h4 v-for="line in suffixLines">{{ line }}</h4>
    <p class="small-text">(Released as a single on 18 August 1989)</p>
  </section>

  <button @click="editSuffix" class="small secondary">Edit suffix text</button>
  <button @click="copyText" @keyup.enter="copyText" class="small tertiary">Copy full text</button>

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
import {computed, ref} from 'vue'
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

const prefixMentionsPumpUpTheJam = computed(() => {
  const lowercaseValue = prefixText.value.toLowerCase()

  return (
    lowercaseValue.includes('pump up the jam') ||
    lowercaseValue.includes('technotronic') ||
    lowercaseValue.includes('ya kid k') ||
    lowercaseValue.includes('manuela kamosi') ||
    lowercaseValue.includes('thomas de quincey') ||
    lowercaseValue.includes('techno music')
  )
})

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
  const unrelatedText = prefixMentionsPumpUpTheJam.value ? '' : 'unrelated '
  const compiledSuffix = suffixLines.value
    .join(' ')
    .replace('<span v-if="!prefixMentionsPumpUpTheJam">unrelated</span>', unrelatedText.trim())

  let textToCopy
  if (props.isSameDate) {
    textToCopy = `${props.isToday ? 'Today is' : prefixText.value} the same date as ${compiledSuffix} (Released as a single on 18 August 1989)`
  } else {
    textToCopy = `${props.isToday ? 'Today is' : prefixText.value} ${props.formattedTimeDifference} ${props.isToday || (!props.isToday && props.timeDifferenceMs > 0) ? 'after' : 'before'} ${compiledSuffix} (Released as a single on 18 August 1989)`
  }
  navigator.clipboard.writeText(textToCopy)
}
</script>
