<template>
  <section class="wrapper-section">
    <DatePicker v-model="selectedDate" />

    <p class="countdown-units" v-if="isToday(userDate)">Today is</p>
    <p class="countdown-units" v-else>The chosen date is</p>
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
    <p class="countdown-units bold">
      Pump Up The Jam
      <span class="tooltip">Which was released on 18 August 1989</span>
    </p>
  </section>
</template>

<script setup>
import {ref, computed} from 'vue'

import DatePicker from '@/components/DatePicker.vue'

const pumpUpTheJamReleaseDate = new Date('18 August 1989')

const selectedDate = ref(new Date().toISOString().split('T')[0])

const userDate = computed(() => new Date(selectedDate.value))

const isToday = date => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const timeDifferenceMs = computed(() => {
  return userDate.value.getTime() - pumpUpTheJamReleaseDate.getTime()
})

const formatTimeDifference = ms => {
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
      return Math.random() > 0.5
        ? `About ${nextMillennium} thousand years`
        : `Nearly than ${nextMillennium} millennium`
    } else if (years >= 1000 && years - millennium * 1000 <= 50) {
      return Math.random() > 0.5
        ? `About ${millennium} thousand years`
        : `Slightly more than ${millennium} millennium`
    }
  }

  if (years > 100) {
    const century = Math.floor(years / 100)
    const nextCentury = century + 1
    const distanceToNextCentury = nextCentury * 100 - years
    const distanceToPrevCentury = years - century * 100

    const randomChoice = Math.random() > 0.5

    if (distanceToNextCentury <= 15 && randomChoice) {
      return `Nearly ${nextCentury} ${nextCentury === 1 ? 'century' : 'centuries'}`
    } else if (distanceToPrevCentury <= 15 && randomChoice) {
      return `Slightly more than ${century} ${century === 1 ? 'century' : 'centuries'}`
    } else {
      const roundedYears = Math.round(years / 10) * 10
      return `About ${roundedYears} years`
    }
  } else if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`
  }
}

const timeDifference = computed(() => {
  if (isToday(userDate.value)) {
    return `<span class="bold primary">${formatTimeDifference(timeDifferenceMs.value)}</span>`
  } else {
    if (timeDifferenceMs.value > 0) {
      return `Chosen date is <span class="bold primary">${formatTimeDifference(timeDifferenceMs.value)}</span> after`
    } else {
      return `Chosen date is <span class="bold primary">${formatTimeDifference(timeDifferenceMs.value)}</span> before`
    }
  }
})
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
  }
}

@media screen and (min-width: 512px) {
  .countdown-units {
    font-size: 2rem;
    margin-block: 0.5rem;
  }
}

.tooltip {
  pointer-events: none;
}
</style>
