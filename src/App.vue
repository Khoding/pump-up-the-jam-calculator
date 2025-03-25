<template>
  <div class="h1-wrapper center-align top-margin">
    <h1 class="h1">Pump Up The Jam Calculator</h1>
  </div>

  <main class="center-align top-margin bottom-margin">
    <Calculator />
  </main>

  <p class="center-align bottom-margin left-padding right-padding">
    <a
      href="https://youtu.be/-Su287HvJRQ?si=m3sR7GWcSeNBvSpc"
      class="link"
      target="_blank"
      rel="noopener noreferrer"
      >Every 'Pump Up The Jam' Segue - Philomena Cunk</a
    >
  </p>
</template>

<script setup>
import Calculator from '@/components/Calculator.vue'
</script>

<style scoped>
.h1-wrapper {
  display: flex;
  margin-block-start: 0;
}

.h1 {
  font-size: 1.5rem;
  inline-size: 16ch;
  min-inline-size: 16ch;
}

@media screen and (min-width: 20rem) {
  .h1 {
    font-size: 2rem;
  }
}

@media screen and (min-width: 32rem) {
  .h1 {
    font-size: 2.5rem;
  }
}

@media screen and (min-width: 44rem) {
  .h1 {
    font-size: 3rem;
  }
}

@media screen and (min-width: 56rem) {
  .h1 {
    inline-size: 24ch;
    font-size: 4rem;
  }
}
</style>
