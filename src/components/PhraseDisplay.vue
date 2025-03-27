<template>
  <section class="wrapper-section">
    <p class="countdown-units" v-if="isToday">Today is</p>

    <EditableText v-else v-model="prefixText" label="Prefix sentence" />

    <p class="countdown-units bold primary">{{ formattedTimeDifference }}</p>
    <p class="countdown-units" v-if="isToday || (!isToday && timeDifferenceMs > 0 && !isSameDate)">
      after
    </p>
    <p class="countdown-units" v-else-if="!isSameDate">before</p>

    <p class="countdown-units">
      the release of <span v-if="!prefixMentionsPumpUpTheJam">unrelated</span>
    </p>
    <p class="countdown-units">Belgian Techno anthem</p>
    <p class="countdown-units bold">Pump Up The Jam</p>
    <p class="small-text">(Released as a single on 18 August 1989)</p>
  </section>

  <button @click="copyText" @keyup.enter="copyText">Copy full text</button>
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

const prefixText = ref('The chosen date is')

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
    textToCopy = `${props.isToday ? 'Today is' : prefixText.value} the same date as the release of ${unrelatedText}Belgian Techno anthem "Pump Up The Jam" (Released as a single on 18 August 1989)`
  } else {
    textToCopy = `${props.isToday ? 'Today is' : prefixText.value} ${props.formattedTimeDifference} ${props.isToday || (!props.isToday && props.timeDifferenceMs > 0) ? 'after' : 'before'} the release of ${unrelatedText}Belgian Techno anthem "Pump Up The Jam" (Released as a single on 18 August 1989)`
  }
  navigator.clipboard.writeText(textToCopy)
}
</script>

<style scoped>
.wrapper-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: 16px;
}

.countdown-units {
  font-size: 1.5rem;
  margin-block: 0.25rem;
  text-wrap: pretty;

  &.bold.primary {
    line-height: normal;
    max-inline-size: 18ch;
    white-space: inherit;
  }
}

@media screen and (min-width: 32rem) {
  .countdown-units {
    font-size: 2rem;
    margin-block: 0.5rem;

    &.bold.primary {
      max-inline-size: none;
    }
  }
}
</style>
