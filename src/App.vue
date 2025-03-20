<template>
  <div class="h1-wrapper center-align top-margin">
    <h1 class="h1">Pump Up The Jam Calculator</h1>
  </div>

  <main class="center-align top-margin">
    <Calculator />
  </main>
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
  font-size: 2rem;
  inline-size: 16ch;
  min-inline-size: 16ch;
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
