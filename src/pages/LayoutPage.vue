<template>
  <header>
    <HeaderBar/>
  </header>
  <main>
    <v-menu v-model="isAlert" transition="slide-x-transition">
      <v-alert
          border="start"
          border-color="teal-accent-3"
          color="blue-grey"
          elevation="5"
          icon="$success"
          type="success"
          v-model="isAlert"
          width="17em"
          position="absolute"
          transition="slide-y-transition"
      >
        Данные обновлены
      </v-alert>
    </v-menu>
      <RecordsTable/>
  </main>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue';
import RecordsTable from '@/components/RecordsTable.vue';
import {toRefs} from 'vue';
import {useRecordsStore} from '@/stores/records';

const store = useRecordsStore();
const {isAlert} = toRefs(store);
</script>

<style scoped>
main {
  height: 100%;
}

.v-menu {
  transition: 1s ease-in-out;
  left: 10px;
  top: 10px;
}
</style>