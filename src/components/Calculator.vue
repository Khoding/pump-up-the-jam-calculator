<template>
  <section class="wrapper-section">
    <DatePicker v-model="selectedDate" />

    <p class="countdown-units" v-if="isToday(userDate)">Today is</p>
    <p class="countdown-units" v-else-if="isExtremeDuration">The chosen date is</p>
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

// Helper computed property to determine if we're dealing with an extreme timeline
const isExtremeDuration = computed(() => {
  if (userDate.value.isExtended) {
    return Math.abs(userDate.value.yearDifference) > 1000
  }
  return Math.abs(timeDifferenceMs.value) > 1000 * 365.25 * 24 * 60 * 60 * 1000
})

const formatTimeDifference = ms => {
  // Special handling for extended dates
  if (userDate.value.isExtended) {
    const absYearDiff = Math.abs(userDate.value.yearDifference)

    // Display based on magnitude with properly posh British wording
    if (absYearDiff >= 1000000000) {
      return `a most remarkable ${(absYearDiff / 1000000000).toFixed(1)} billion years, I dare say`
    }
    if (absYearDiff >= 1000000) {
      return `precisely ${(absYearDiff / 1000000).toFixed(1)} million years, rather extraordinary`
    }
    if (absYearDiff >= 1000) {
      return `approximately ${(absYearDiff / 1000).toFixed(1)} thousand years, quite substantial indeed`
    }
    // Always use elaborate phrasing regardless of timespan
    return absYearDiff > 100
      ? `a thoroughly calculated ${absYearDiff} years, if I may be so precise`
      : `precisely ${absYearDiff} years, as one would expect`
  }

  // Regular formatting for normal dates with British flair
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
      return `very nearly ${nextMillennium} thousand years, approaching the milestone rather splendidly`
    } else if (years >= 1000 && years - millennium * 1000 <= 50) {
      return `marginally exceeding ${millennium} ${millennium === 1 ? 'millennium' : 'millennia'}, most impressive`
    }
  }

  if (years > 100) {
    const century = Math.floor(years / 100)
    const nextCentury = century + 1
    const distanceToNextCentury = nextCentury * 100 - years
    const distanceToPrevCentury = years - century * 100

    if (distanceToNextCentury <= 15) {
      return `approaching ${nextCentury} ${nextCentury === 1 ? 'century' : 'centuries'} with remarkable haste, I must say`
    } else if (distanceToPrevCentury <= 15) {
      return `a smidgen over ${century} ${century === 1 ? 'century' : 'centuries'}, if one wishes to be precise`
    } else {
      const roundedYears = Math.round(years / 10) * 10
      return `approximately ${roundedYears} years, give or take a fortnight`
    }
  } else if (years > 0) {
    return `precisely ${years} ${years === 1 ? 'year' : 'years'}, as the calendar would suggest`
  } else if (months > 0) {
    return `a matter of ${months} ${months === 1 ? 'month' : 'months'}, if you'll pardon my exactitude`
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} on the dot, by my calculations`
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} precisely, as the timepiece indicates`
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, according to my pocket watch`
  } else {
    return `a mere ${seconds} ${seconds === 1 ? 'second' : 'seconds'}, hardly worth mentioning`
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
