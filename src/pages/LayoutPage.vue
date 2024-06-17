<template>
  <header>
    <HeaderBar />
  </header>

  <main>
    <v-container class="ma-auto rounded-xl text-center align-content-center h-100">
      <v-data-table-server
          :headers="headers"
          :items="records"
          :items-per-page="itemsPerPage"
          v-model:page="currentPage"
          :items-length="totalRecords"
          :server-items-length="totalRecords"
          :loading="loading"
          @update:options="updateOptions"
          class="bg-blue-grey-darken-3 elevation-10 px-5 py-3 w-xl-auto"
      />
    </v-container>
  </main>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue';
import { useRecordsStore } from '@/stores/records';
import { ref, watch, onMounted, toRefs } from 'vue';

const headers = [
  { title: 'Фамилия', value: 'f', sortable: true },
  { title: 'Имя', value: 'i', sortable: true },
  { title: 'Отчество', value: 'o', sortable: true },
  { title: 'Город', value: 'city', sortable: true },
  { title: 'Адрес', value: 'address', sortable: true },
  { title: 'Дата рождения', value: 'birthday', sortable: true },
  { title: 'Телефон', value: 'phone', sortable: true },
];

const store = useRecordsStore();
const { records, itemsPerPage, fetchAllRecords, totalPages, loading, totalRecords } = toRefs(store);
const currentPage = ref(1);
const sortBy = ref<string | null>(null);
const sortDesc = ref<boolean>(false);

function updateOptions(options) {
  console.log('update:options', options);
  currentPage.value = options.page;
  if (options.sortBy.length) {
    sortBy.value = options.sortBy[0].key;
    sortDesc.value = options.sortBy[0].order === 'desc';
  } else {
    sortBy.value = null;
    sortDesc.value = false;
  }
  console.log('Current page:', currentPage.value);
  console.log('Sort by:', sortBy.value);
  console.log('Sort desc:', sortDesc.value);
}

watch([currentPage, sortBy, sortDesc], ([newPage, newSortBy, newSortDesc]) => {
  console.log('Parameters changed - Page:', newPage, 'Sort by:', newSortBy, 'Sort desc:', newSortDesc);
  fetchAllRecords.value({ page: newPage, sortBy: newSortBy, sortDesc: newSortDesc }).then(() => {
    console.log('Records updated:', records.value);
  });
});

onMounted(() => {
  fetchAllRecords.value({ page: currentPage.value, sortBy: sortBy.value, sortDesc: sortDesc.value }).then(() => {
    console.log('Initial records:', records.value);
  });
});

watch(records, (newRecords) => {
  console.log('Records changed:', newRecords);
});
</script>

<style scoped>
main {
  height: 100%;
}
</style>
