<template>
  <section class="vertical">
    <EditableText v-model="prefixText" />

    <nav class="center-align">
      <article class="primary-container auto-width">
        <h4 class="bold">{{ formattedTimeDifference }}</h4>
      </article>
    </nav>

    <h6 v-if="!isSameDate">
      {{ isToday || (!isToday && timeDifferenceMs > 0) ? 'after' : 'before' }}
    </h6>

    <h4>
      the <span v-if="includeYear && !isSameDate">1989</span> release of
      <span v-if="!prefixMentionsPumpUpTheJam">unrelated</span>
    </h4>
    <h4>Belgian Techno anthem</h4>
    <h4 class="bold">Pump Up The Jam</h4>

    <p class="small-text">(Released as a single on 18 August 1989)</p>
  </section>

  <button @click="copyText" @keyup.enter="copyText" class="small tertiary">Copy text</button>
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
const includeYear = computed(() => {
  return props.timeDifferenceMs !== undefined ? (Math.random() > 0.5 ? '1989 ' : '') : ''
})

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

const copyText = () => {
  const unrelatedText = prefixMentionsPumpUpTheJam.value ? '' : 'unrelated '

  let textToCopy
  if (props.isSameDate) {
    textToCopy = `${prefixText.value} the same date as the release of ${unrelatedText}Belgian Techno anthem "Pump Up The Jam"`
  } else {
    textToCopy = `${prefixText.value} ${props.formattedTimeDifference} ${props.isToday || (!props.isToday && props.timeDifferenceMs > 0) ? 'after' : 'before'} the ${includeYear.value}release of ${unrelatedText}Belgian Techno anthem "Pump Up The Jam"`
  }
  navigator.clipboard.writeText(textToCopy)
}
</script>
