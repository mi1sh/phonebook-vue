<template>
  <header>
    <HeaderBar/>
  </header>
  <main>
    <RecordsTable/>
  </main>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue';
import RecordsTable from '@/components/RecordsTable.vue';
</script>

<style scoped>
main {
  height: 100%;
}
</style>