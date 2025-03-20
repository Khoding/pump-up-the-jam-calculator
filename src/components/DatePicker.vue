<template>
  <div class="field label prefix border top-margin">
    <i>today</i>
    <input
      :value="displayValue"
      @input="handleInput"
      type="text"
      placeholder="DD/MM/YYYY or '65M BC'"
      @blur="validateAndFormat"
    />
    <label>Date</label>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const model = defineModel({
  type: String,
  required: true,
})

const displayValue = ref('')

// Format extended date strings for display
function formatDateForDisplay(dateString) {
  // Check for extended date format (contains special prefix)
  if (dateString.startsWith('ext:')) {
    const parts = dateString.substring(4).split(':')
    const year = parseInt(parts[0])
    const era = parts[1] || 'AD'

    // Format large numbers with appropriate units
    if (Math.abs(year) >= 1000000000) {
      return `${(year / 1000000000).toFixed(1)}B ${era}`
    } else if (Math.abs(year) >= 1000000) {
      return `${(year / 1000000).toFixed(1)}M ${era}`
    } else if (Math.abs(year) >= 1000) {
      return `${(year / 1000).toFixed(1)}K ${era}`
    }
    return `${year} ${era}`
  }

  // Standard date formatting for dates within JavaScript's range
  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    }
  } catch (e) {}

  return dateString
}

// Parse user input and convert to appropriate date format
function parseUserInput(input) {
  // Clean the input
  const cleanInput = input.trim()

  // Extended date format patterns for geological time scales
  const extendedPatterns = [
    // Thousands of years (10K BC, 10 thousand BC)
    {
      regex: /^(\d+(?:\.\d+)?)\s*[Kk](?:\s+(?:BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 1000)}:BC`,
    },
    {
      regex:
        /^(\d+(?:\.\d+)?)\s*(?:thousand|[Kk])\s*(?:years?)?(?:\s+(?:ago|before|BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 1000)}:BC`,
    },
    {
      regex: /^(\d+(?:\.\d+)?)\s*(?:thousand|[Kk])(?:\s+(?:AD|A\.D\.|CE))?$/i,
      format: m => `ext:${Math.round(parseFloat(m[1]) * 1000)}:AD`,
    },

    // Millions of years (65M BC, 65 million BC)
    {
      regex: /^(\d+(?:\.\d+)?)\s*[Mm](?:\s+(?:BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 1000000)}:BC`,
    },
    {
      regex:
        /^(\d+(?:\.\d+)?)\s*(?:million|[Mm])\s*(?:years?)?(?:\s+(?:ago|before|BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 1000000)}:BC`,
    },
    {
      regex: /^(\d+(?:\.\d+)?)\s*(?:million|[Mm])(?:\s+(?:AD|A\.D\.|CE))?$/i,
      format: m => `ext:${Math.round(parseFloat(m[1]) * 1000000)}:AD`,
    },

    // Billions of years (4.5B BC, 4.5 billion BC)
    {
      regex: /^(\d+(?:\.\d+)?)\s*[Bb](?:\s+(?:BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 1000000000)}:BC`,
    },
    {
      regex:
        /^(\d+(?:\.\d+)?)\s*(?:billion|[Bb])\s*(?:years?)?(?:\s+(?:ago|before|BC|B\.C\.|BCE))?$/i,
      format: m => `ext:${-Math.round(parseFloat(m[1]) * 1000000000)}:BC`,
    },
    {
      regex: /^(\d+(?:\.\d+)?)\s*(?:billion|[Bb])(?:\s+(?:AD|A\.D\.|CE))?$/i,
      format: m => `ext:${Math.round(parseFloat(m[1]) * 1000000000)}:AD`,
    },

    // Direct year specifications with era
    {
      regex: /^(\d+)\s*(?:BC|B\.C\.|BCE)$/i,
      format: m => `ext:${-parseInt(m[1])}:BC`,
    },
    {
      regex: /^(\d+)\s*(?:AD|A\.D\.|CE)$/i,
      format: m => `ext:${parseInt(m[1])}:AD`,
    },

    // Direct future years
    {
      regex: /^(\d{5,})\s*(?:in future)?$/i,
      format: m => `ext:${parseInt(m[1])}:AD`,
    },
  ]

  // Check extended date patterns first
  for (const pattern of extendedPatterns) {
    const match = cleanInput.match(pattern.regex)
    if (match) {
      return pattern.format(match)
    }
  }

  // Add a debugging log to see which formats we're trying to parse
  console.log('Failed to parse as extended format:', cleanInput)

  // Try standard date formats
  const patterns = [
    // DD/MM/YYYY or DD-MM-YYYY
    {
      regex: /^(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{4})$/,
      format: m => `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`,
    },
    // MM/DD/YYYY or MM-DD-YYYY
    {
      regex: /^(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{4})$/,
      format: m => `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`,
    },
    // YYYY/MM/DD or YYYY-MM-DD
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

  // Try to let JavaScript parse the date naturally
  try {
    const date = new Date(cleanInput)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  } catch (e) {}

  return null
}

// Rest of the functions remain the same
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
    // Revert to the current valid date if input is invalid
    displayValue.value = formatDateForDisplay(model.value)
  }
}

// Initialize display value from model
onMounted(() => {
  displayValue.value = formatDateForDisplay(model.value)
})
</script>
