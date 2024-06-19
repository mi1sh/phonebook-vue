<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue';
import { useRecordsStore } from '@/stores/records';
import { ref, watch, onMounted, toRefs, computed } from 'vue';

const store = useRecordsStore();
const { records, itemsPerPage, fetchAllRecords, loading, totalRecords } = toRefs(store);
const currentPage = ref(1);
const sortBy = ref<string | null>(null);
const sortDesc = ref<boolean>(false);
const filters = ref({
  f: '',
  i: '',
  o: '',
  city: '',
  address: '',
  birthday: '',
  phone: ''
});

const headers = [
  { title: 'Фамилия', value: 'f', sortable: true },
  { title: 'Имя', value: 'i', sortable: true },
  { title: 'Отчество', value: 'o', sortable: true },
  { title: 'Город', value: 'city', sortable: true },
  { title: 'Адрес', value: 'address', sortable: true },
  { title: 'Дата рождения', value: 'birthday', sortable: true },
  { title: 'Телефон', value: 'phone', sortable: true }
];

function updateOptions(options) {
  currentPage.value = options.page;
  if (options.sortBy.length) {
    sortBy.value = options.sortBy[0].key;
    sortDesc.value = options.sortBy[0].order === 'desc';
  } else {
    sortBy.value = null;
    sortDesc.value = false;
  }
  fetchAllRecordsWithParams();
}

function updateFilters() {
  fetchAllRecordsWithParams();
}

function fetchAllRecordsWithParams() {
  const filterParams = {
    ...filters.value,
    page: currentPage.value,
    sortBy: sortBy.value,
    sortDesc: sortDesc.value
  };
  fetchAllRecords.value(filterParams);
}

watch([currentPage, sortBy, sortDesc], fetchAllRecordsWithParams);

onMounted(() => {
  fetchAllRecordsWithParams();
});

watch(records, (newRecords) => {
  console.log('Records changed:', newRecords);
});
</script>
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
      >
        <template #top>
          <v-row>
            <v-col v-for="header in headers" :key="header.value">
              <v-text-field
                  v-model="filters[header.value]"
                  :label="header.title"
                  variant="outlined"
                  dense
                  hide-details
                  @input="updateFilters"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
      </v-data-table-server>
    </v-container>
  </main>
</template>
<style scoped>
main {
  height: 100%;
}
</style>