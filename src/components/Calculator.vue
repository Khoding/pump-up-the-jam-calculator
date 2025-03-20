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
    <p class="countdown-units bold">Pump Up The Jam</p>
    <p class="small-text">(Released as a single on 18 August 1989)</p>
  </section>
</template>

<script setup>
import {ref, computed} from 'vue'

import DatePicker from '@/components/DatePicker.vue'

// Original release date remains the same
const pumpUpTheJamReleaseDate = new Date(1989, 7, 18)
const pumpUpTheJamYear = 1989
const pumpUpTheJamTimestamp = pumpUpTheJamReleaseDate.getTime()

const selectedDate = ref(new Date().toISOString().split('T')[0])

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

    // Display based on magnitude
    if (absYearDiff >= 1000000000) {
      return `${(absYearDiff / 1000000000).toFixed(1)} billion years`
    }
    if (absYearDiff >= 1000000) {
      return `${(absYearDiff / 1000000).toFixed(1)} million years`
    }
    if (absYearDiff >= 1000) {
      return `${(absYearDiff / 1000).toFixed(1)} thousand years`
    }
    return `${absYearDiff} years`
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

@media screen and (min-width: 32rem) {
  .countdown-units {
    font-size: 2rem;
    margin-block: 0.5rem;
  }
}

.tooltip {
  pointer-events: none;
}
</style>
