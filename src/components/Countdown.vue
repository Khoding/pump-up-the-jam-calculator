<template>
  <section class="wrapper-section">
    <DatePicker v-model="selectedDate" />

    <p class="countdown-units">
      {{ timeDifference }}
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
        ? `about ${nextMillennium} thousand years`
        : `nearly than ${nextMillennium} millennium`
    } else if (years >= 1000 && years - millennium * 1000 <= 50) {
      return Math.random() > 0.5
        ? `about ${millennium} thousand years`
        : `slightly more than ${millennium} millennium`
    }
  }

  if (years > 100) {
    const century = Math.floor(years / 100)
    const nextCentury = century + 1
    const distanceToNextCentury = nextCentury * 100 - years
    const distanceToPrevCentury = years - century * 100

    const randomChoice = Math.random() > 0.5

    if (distanceToNextCentury <= 15 && randomChoice) {
      return `nearly ${nextCentury} ${nextCentury === 1 ? 'century' : 'centuries'}`
    } else if (distanceToPrevCentury <= 15 && randomChoice) {
      return `slightly more than ${century} ${century === 1 ? 'century' : 'centuries'}`
    } else {
      const roundedYears = Math.round(years / 10) * 10
      return `about ${roundedYears} years`
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
    return `We are ${formatTimeDifference(timeDifferenceMs.value)} after "Pump Up The Jam" release`
  } else {
    if (timeDifferenceMs.value > 0) {
      return `${formatTimeDifference(timeDifferenceMs.value)} after "Pump Up The Jam" release`
    } else {
      return `${formatTimeDifference(timeDifferenceMs.value)} before "Pump Up The Jam" release`
    }
  }
})
</script>

<style scoped>
.wrapper-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-units {
  font-size: 2rem;
  line-height: normal;
}
</style>
