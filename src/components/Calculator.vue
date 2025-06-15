<template>
  <DatePicker v-model="selectedDate" />
  <PhraseDisplay
    :timeDifferenceMs="timeDifferenceMs"
    :formattedTimeDifference="formatTimeDifference(timeDifferenceMs)"
    :isToday="isToday(userDate)"
    :isSameDate="isSameDate"
    :isExtendedDate="userDate.isExtended"
  />
</template>

<script setup>
import {ref, computed} from 'vue'
import DatePicker from '@/components/DatePicker.vue'
import PhraseDisplay from '@/components/PhraseDisplay.vue'

const pumpUpTheJamReleaseDate = new Date(1989, 7, 18)
const pumpUpTheJamYear = pumpUpTheJamReleaseDate.getFullYear()
const pumpUpTheJamTimestamp = pumpUpTheJamReleaseDate.getTime()

const today = new Date()
const selectedDate = ref(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
)

const userDate = computed(() => {
  if (selectedDate.value.startsWith('ext:')) {
    const parts = selectedDate.value.substring(4).split(':')
    const year = parseInt(parts[0])
    const era = parts[1] || 'AD'

    const yearDifferenceFromReference =
      era === 'BC' ? pumpUpTheJamYear + Math.abs(year) : year - pumpUpTheJamYear

    return {
      isExtended: true,
      year: year,
      era: era,
      yearDifference: yearDifferenceFromReference,
      timestamp: year * 365.25 * 24 * 60 * 60 * 1000,
    }
  }

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

const isSameDate = computed(() => {
  if (userDate.value.isExtended) return false
  return Math.abs(timeDifferenceMs.value) < 86400000
})

const formatTimeDifference = ms => {
  if (Math.abs(ms) < 86400000 && !userDate.value.isExtended) {
    return 'the same date as'
  }

  if (userDate.value.isExtended) {
    const absYearDiff = Math.abs(userDate.value.yearDifference)

    if (absYearDiff >= 10 ** 9) {
      return `around ${(absYearDiff / 10 ** 9).toFixed(1)} billion years`
    }
    if (absYearDiff >= 10 ** 6) {
      return `around ${(absYearDiff / 10 ** 6).toFixed(1)} million years`
    }
    if (absYearDiff >= 10 ** 3) {
      return `around ${(absYearDiff / 10 ** 3).toFixed(1)} thousand years`
    }
    return absYearDiff > 100 ? `approximately ${absYearDiff} years` : `${absYearDiff} years`
  }

  const absMs = Math.abs(ms)

  const seconds = Math.floor(absMs / 1000)
  const days = Math.floor(seconds / (60 * 60 * 24))
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
  } else {
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }
}
</script>
