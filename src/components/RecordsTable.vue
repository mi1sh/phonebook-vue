<script setup lang="ts">
import {useRecordsStore} from '@/stores/records';
import {ref, watch, onMounted, toRefs} from 'vue';

const store = useRecordsStore();
const {records, itemsPerPage, fetchAllRecords, deleteRecord, loading, totalRecords} = toRefs(store);
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
const editedItem = ref({
  f: '',
  i: '',
  o: '',
  city: '',
  address: '',
  birthday: '',
  phone: ''
});
const isDialogOpen = ref(false);
const valid = ref(false);
const dialogTitle = ref('Добавить запись');

const headers = [
  {title: 'Фамилия', value: 'f', sortable: true},
  {title: 'Имя', value: 'i', sortable: true},
  {title: 'Отчество', value: 'o', sortable: true},
  {title: 'Город', value: 'city', sortable: true},
  {title: 'Адрес', value: 'address', sortable: true},
  {title: 'Дата рождения', value: 'birthday', sortable: true},
  {title: 'Телефон', value: 'phone', sortable: true},
  {title: '', value: 'actions', sortable: false}
];

function openDialog(item) {
  if (item) {
    editedItem.value = {...item};
    dialogTitle.value = 'Изменить запись';
  } else {
    editedItem.value = {
      f: '',
      i: '',
      o: '',
      city: '',
      address: '',
      birthday: '',
      phone: ''
    };
    dialogTitle.value = 'Добавить запись';
  }
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}

function saveRecord() {
  if (valid.value) {
    if (editedItem.value.id) {
      store.updateRecord(editedItem.value);
    } else {
      store.createRecord(editedItem.value);
    }
    closeDialog();
    fetchAllRecordsWithParams();
  }
}

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
        class="bg-blue-grey-darken-3 mt-15 elevation-10 px-5 py-3 w-xl-auto"
    >
      <template #top>
        <v-container>
          <v-btn prepend-icon="mdi-plus" class="float-left" variant="outlined" @click="openDialog(null)">Добавить
          </v-btn>
        </v-container>
        <v-row>
          <v-col>
            <v-text-field
                v-model="filters.f"
                label="Фамилия"
                variant="outlined"
                dense
                hide-details
                @input="updateFilters"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                v-model="filters.i"
                label="Имя"
                variant="outlined"
                dense
                hide-details
                @input="updateFilters"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                v-model="filters.o"
                label="Отчество"
                variant="outlined"
                dense
                hide-details
                @input="updateFilters"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                v-model="filters.city"
                label="Город"
                variant="outlined"
                dense
                hide-details
                @input="updateFilters"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                v-model="filters.address"
                label="Адрес"
                variant="outlined"
                dense
                hide-details
                @input="updateFilters"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                v-model="filters.birthday"
                label="Дата рождения"
                variant="outlined"
                dense
                hide-details
                @input="updateFilters"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
                v-model="filters.phone"
                label="Телефон"
                variant="outlined"
                dense
                hide-details
                @input="updateFilters"
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template #item.actions="{ item }">
        <v-icon icon="mdi-pencil" @click="openDialog(item)"></v-icon>
        <v-icon icon="mdi-delete" color="red" @click="deleteRecord(item.id)"></v-icon>
      </template>
    </v-data-table-server>
    <v-dialog v-model="isDialogOpen" max-width="500px">
      <v-card class="bg-blue-grey-darken-3">
        <v-card-title>
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field variant="outlined" v-model="editedItem.f" :rules="[v => !!v || 'Фамилия обязательна']"
                          label="Фамилия"></v-text-field>
            <v-text-field variant="outlined" v-model="editedItem.i" label="Имя"></v-text-field>
            <v-text-field variant="outlined" v-model="editedItem.o" label="Отчество"></v-text-field>
            <v-text-field variant="outlined" v-model="editedItem.city" label="Город"></v-text-field>
            <v-text-field variant="outlined" v-model="editedItem.address" label="Адрес"></v-text-field>
            <v-text-field variant="outlined" v-model="editedItem.birthday" label="Дата рождения"></v-text-field>
            <v-text-field variant="outlined" v-model="editedItem.phone" label="Телефон"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
          <v-btn variant="outlined" color="blue darken-1" text @click="saveRecord">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>