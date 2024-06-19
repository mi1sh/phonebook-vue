import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useRecordsStore = defineStore('records', () => {
	const records = ref<any[]>([]);
	const loading = ref(false);
	const totalPages = ref(0);
	const totalRecords = ref(0);
	const error = ref<string | null>(null);
	const itemsPerPage = ref(10);
	const allFilters = ref({});

	const fetchAllRecords = async (filters = {}) => {
		loading.value = true;
		error.value = null;
		allFilters.value = filters;
		const authStore = useAuthStore();

		if (!authStore.token) {
			error.value = 'Token is not available';
			loading.value = false;
			console.error(error);
			return;
		}

		try {
			console.log('Fetching records with filters:', filters);
			const params = {
				page: filters.page || 1,
				per_page: itemsPerPage.value,
				sort: filters.sortBy ? `${filters.sortDesc ? '-' : ''}${filters.sortBy}` : undefined,
				...filters
			};

			const response = await axios.get('https://phonebook.ddirection.kz/records', {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
				params,
			});

			console.log('Response:', response.data);

			totalRecords.value = response.data._meta.totalCount;
			totalPages.value = Math.ceil(response.data._meta.totalCount / itemsPerPage.value);
			records.value = response.data.items;
			itemsPerPage.value = response.data._meta.pageSize;

			console.log('Updated records:', records.value);
		} catch (err: any) {
			error.value = err.message;
			console.error('Fetch records error:', err);
		} finally {
			loading.value = false;
		}
	};

	const createRecord = async (record) => {
		const authStore = useAuthStore();

		try {
			await axios.post('https://phonebook.ddirection.kz/records', record, {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
			});
			fetchAllRecords(allFilters.value); // Update the table after creation
		} catch (err: any) {
			error.value = err.message;
			console.error('Create record error:', err);
		}
	};

	const updateRecord = async (record) => {
		const authStore = useAuthStore();

		try {
			await axios.put(`https://phonebook.ddirection.kz/records/${record.id}`, record, {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
			});
			fetchAllRecords(allFilters.value); // Update the table after update
		} catch (err: any) {
			error.value = err.message;
			console.error('Update record error:', err);
		}
	};

	const deleteRecord = async (id) => {
		const authStore = useAuthStore();

		try {
			await axios.delete(`https://phonebook.ddirection.kz/records/${id}`, {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
			});
			fetchAllRecords(allFilters.value); // Update the table after deletion
		} catch (err: any) {
			error.value = err.message;
			console.error('Delete record error:', err);
		}
	};

	return { records, loading, error, fetchAllRecords, createRecord, updateRecord, deleteRecord, itemsPerPage, allFilters, totalPages, totalRecords };
});
