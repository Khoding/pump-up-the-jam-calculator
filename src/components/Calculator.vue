<template>
  <section class="wrapper-section">
    <DatePicker v-model="selectedDate" />

    <p class="countdown-units" v-if="isToday(userDate)">Today is</p>
    <nav v-else class="center-align">
      <p class="countdown-units" v-if="!isEditing">{{ modelValue }}</p>
      <div class="field label border no-margin no-padding" v-else>
        <input v-model="editingValue" @keyup.enter="toggleEdit" type="text" ref="inputRef" />
        <label>Prefix sentence</label>
      </div>
      <button
        class="circle fill"
        @click="toggleEdit"
        :aria-label="isEditing ? 'Save text' : 'Edit text'"
      >
        <i>{{ isEditing ? 'save' : 'edit' }}</i>
      </button>
    </nav>
    <p class="countdown-units bold primary">{{ formatTimeDifference(timeDifferenceMs) }}</p>
    <p
      class="countdown-units"
      v-if="isToday(userDate) || (!isToday(userDate) && timeDifferenceMs > 0)"
    >
      after
    </p>
    <p class="countdown-units" v-else>before</p>
    <p class="countdown-units">the release of unrelated</p>
    <p class="countdown-units">Belgian Techno anthem</p>
    <p class="countdown-units bold">Pump Up The Jam</p>
    <p class="small-text">(Released as a single on 18 August 1989)</p>
  </section>

  <button @click="copyText" @keyup.enter="copyText" class="bottom-margin">Copy full text</button>
</template>

<script setup>
import {ref, computed, nextTick} from 'vue'

import DatePicker from '@/components/DatePicker.vue'

const pumpUpTheJamReleaseDate = new Date(1989, 7, 18)
const pumpUpTheJamYear = pumpUpTheJamReleaseDate.getFullYear()
const pumpUpTheJamTimestamp = pumpUpTheJamReleaseDate.getTime()

const selectedDate = ref(new Date().toISOString().split('T')[0])

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

const userDate = computed(() => {
  // Check if this is an extended date format
  if (selectedDate.value.startsWith('ext:')) {
    // Parse the extended date
    const parts = selectedDate.value.substring(4).split(':')
    const year = parseInt(parts[0])
    const era = parts[1] || 'AD'

    // For timestamp calculation, we need to properly account for the relationship to our reference date
    // If BC (negative year): Calculate from year 0 to our reference year + years BC
    // If AD: Simply calculate the difference between years
    const yearDifferenceFromReference =
      era === 'BC'
        ? pumpUpTheJamYear + Math.abs(year) // BC years count backwards from 0
        : year - pumpUpTheJamYear // AD years count forward from 0

    return {
      isExtended: true,
      year: year,
      era: era,
      yearDifference: yearDifferenceFromReference,
      // Use the adjusted year difference for timestamp
      timestamp: year * 365.25 * 24 * 60 * 60 * 1000,
    }
  }

  // Standard date handling
  const date = new Date(selectedDate.value)
  date.setHours(0, 0, 0, 0)
  return {
    isExtended: false,
    timestamp: date.getTime(),
    date: date,
  }
})

const isToday = date => {
  if (date.isExtended) return false

  const today = new Date()
  return (
    date.date.getDate() === today.getDate() &&
    date.date.getMonth() === today.getMonth() &&
    date.date.getFullYear() === today.getFullYear()
  )
}

const timeDifferenceMs = computed(() => {
  return userDate.value.timestamp - pumpUpTheJamTimestamp
})

const formatTimeDifference = ms => {
  // Special handling for extended dates
  if (userDate.value.isExtended) {
    const absYearDiff = Math.abs(userDate.value.yearDifference)

    // Display based on magnitude with simple wording that works with before/after
    if (absYearDiff >= 1000000000) {
      return `around ${(absYearDiff / 1000000000).toFixed(1)} billion years`
    }
    if (absYearDiff >= 1000000) {
      return `around ${(absYearDiff / 1000000).toFixed(1)} million years`
    }
    if (absYearDiff >= 1000) {
      return `around ${(absYearDiff / 1000).toFixed(1)} thousand years`
    }
    // Use "approximately" for medium timeframes, nothing for recent dates
    return absYearDiff > 100 ? `approximately ${absYearDiff} years` : `${absYearDiff} years`
  }

  // Regular formatting for normal dates
  const absMs = Math.abs(ms)

  const seconds = Math.floor(absMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years >= 950) {
    const millennium = Math.floor(years / 1000)
    const nextMillennium = millennium + 1
    const distanceToNextMillennium = nextMillennium * 1000 - years

    if (distanceToNextMillennium <= 50) {
      return `nearly ${nextMillennium} thousand years`
    } else if (years >= 1000 && years - millennium * 1000 <= 50) {
      return `slightly more than ${millennium} ${millennium === 1 ? 'millennium' : 'millennia'}`
    }
  }

  if (years > 100) {
    const century = Math.floor(years / 100)
    const nextCentury = century + 1
    const distanceToNextCentury = nextCentury * 100 - years
    const distanceToPrevCentury = years - century * 100

    if (distanceToNextCentury <= 15) {
      return `nearly ${nextCentury} ${nextCentury === 1 ? 'century' : 'centuries'}`
    } else if (distanceToPrevCentury <= 15) {
      return `just over ${century} ${century === 1 ? 'century' : 'centuries'}`
    } else {
      const roundedYears = Math.round(years / 10) * 10
      return `about ${roundedYears} years`
    }
  } else if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`
  } else if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'}`
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
  }
}

const modelValue = defineModel({
  type: String,
  default: 'The chosen date is',
})

const copyText = () => {
  const textToCopy = `${isToday(userDate.value) ? 'Today is' : modelValue.value} ${formatTimeDifference(timeDifferenceMs.value)} ${isToday(userDate.value) || (!isToday(userDate.value) && timeDifferenceMs.value > 0) ? 'after' : 'before'} the release of unrelated Belgian Techno anthem "Pump Up The Jam" (Released as a single on 18 August 1989)`
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
  white-space: nowrap;

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

.tooltip {
  pointer-events: none;
}
</style>
