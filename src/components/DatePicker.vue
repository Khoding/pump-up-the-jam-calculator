<template>
  <nav class="center-align bottom-padding large-padding">
    <div class="field label prefix border small-width">
      <i>today</i>
      <input :value="displayValue" @input="handleInput" type="text" @blur="validateAndFormat" />
      <label>Date</label>
      <span class="helper">DD/MM/YYYY or '65M BC'</span>
    </div>
  </nav>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const model = defineModel({
  type: String,
  required: true,
})

const displayValue = ref('')

function formatDateForDisplay(dateString) {
  if (dateString.startsWith('ext:')) {
    const parts = dateString.substring(4).split(':')
    const year = parseInt(parts[0])
    const era = parts[1] || 'AD'

    if (Math.abs(year) >= 10 ** 9) {
      return `${(year / 10 ** 9).toFixed(1)}B ${era}`
    } else if (Math.abs(year) >= 10 ** 6) {
      return `${(year / 10 ** 6).toFixed(1)}M ${era}`
    } else if (Math.abs(year) >= 10 ** 3) {
      return `${(year / 10 ** 3).toFixed(1)}K ${era}`
    }
    return `${year} ${era}`
  }
  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    }
  } catch (e) {}

  return dateString
}

function parseUserInput(input) {
  const cleanInput = input.trim()

  const extendedPatterns = [
    {
      regex: /^(\d+(?:\.\d+)?)\s*[Kk](?:\s+(?:BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 10 ** 3)}:BC`,
    },
    {
      regex:
        /^(\d+(?:\.\d+)?)\s*(?:thousand|[Kk])\s*(?:years?)?(?:\s+(?:ago|before|BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 10 ** 3)}:BC`,
    },
    {
      regex: /^(\d+(?:\.\d+)?)\s*(?:thousand|[Kk])(?:\s+(?:AD|A\.D\.|CE))?$/i,
      format: m => `ext:${Math.round(parseFloat(m[1]) * 10 ** 3)}:AD`,
    },

    {
      regex: /^(\d+(?:\.\d+)?)\s*[Mm](?:\s+(?:BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 10 ** 6)}:BC`,
    },
    {
      regex:
        /^(\d+(?:\.\d+)?)\s*(?:million|[Mm])\s*(?:years?)?(?:\s+(?:ago|before|BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 10 ** 6)}:BC`,
    },
    {
      regex: /^(\d+(?:\.\d+)?)\s*(?:million|[Mm])(?:\s+(?:AD|A\.D\.|CE))?$/i,
      format: m => `ext:${Math.round(parseFloat(m[1]) * 10 ** 6)}:AD`,
    },

    {
      regex: /^(\d+(?:\.\d+)?)\s*[Bb](?:\s+(?:BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 10 ** 9)}:BC`,
    },
    {
      regex:
        /^(\d+(?:\.\d+)?)\s*(?:billion|[Bb])\s*(?:years?)?(?:\s+(?:ago|before|BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 10 ** 9)}:BC`,
    },
    {
      regex: /^(\d+(?:\.\d+)?)\s*(?:billion|[Bb])(?:\s+(?:AD|A\.D\.|CE))?$/i,
      format: m => `ext:${Math.round(parseFloat(m[1]) * 10 ** 9)}:AD`,
    },

    {
      regex: /^(\d+)\s*(?:BC|B\.C\.|BCE)$/i,
      format: m => `ext:${-parseInt(m[1])}:BC`,
    },
    {
      regex: /^(\d+)\s*(?:AD|A\.D\.|CE)$/i,
      format: m => `ext:${parseInt(m[1])}:AD`,
    },

    {
      regex: /^(\d{5,})\s*(?:in future)?$/i,
      format: m => `ext:${parseInt(m[1])}:AD`,
    },
  ]
  for (const pattern of extendedPatterns) {
    const match = cleanInput.match(pattern.regex)
    if (match) {
      return pattern.format(match)
    }
  }

  const patterns = [
    {
      regex: /^(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{4})$/,
      format: m => `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`,
    },
    {
      regex: /^(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{4})$/,
      format: m => `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`,
    },
    {
      regex: /^(\d{4})[\/\-\. ](\d{1,2})[\/\-\. ](\d{1,2})$/,
      format: m => `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`,
    },
  ]

  for (const pattern of patterns) {
    const match = cleanInput.match(pattern.regex)
    if (match) {
      try {
        const formatted = pattern.format(match)
        const date = new Date(formatted)
        if (!isNaN(date.getTime())) {
          return formatted
        }
      } catch (e) {}
    }
  }

  try {
    const date = new Date(cleanInput)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  } catch (e) {}

  return null
}

function handleInput(event) {
  displayValue.value = event.target.value

  const parsed = parseUserInput(event.target.value)
  if (parsed) {
    model.value = parsed
  }
}

function validateAndFormat() {
  const parsed = parseUserInput(displayValue.value)
  if (parsed) {
    model.value = parsed
    displayValue.value = formatDateForDisplay(parsed)
  } else if (displayValue.value.trim()) {
    displayValue.value = formatDateForDisplay(model.value)
  }
}

onMounted(() => {
  displayValue.value = formatDateForDisplay(model.value)
})
</script>
