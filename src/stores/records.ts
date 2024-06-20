import {type Ref, ref} from 'vue';
import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from './auth';

interface Filters {
	page?: number;
	per_page?: number;
	sortBy?: string;
	sortDesc?: boolean;
	[key: string]: any;
}

interface Meta {
	totalCount: number;
	pageSize: number;
}

interface Record {
	id?: number;
	[key: string]: any;
}

export const useRecordsStore = defineStore('records', () => {
	const records: Ref<Record[]> = ref([]);
	const loading: Ref<boolean> = ref(false);
	const totalPages: Ref<number> = ref(0);
	const totalRecords: Ref<number> = ref(0);
	const error: Ref<string | null> = ref(null);
	const itemsPerPage: Ref<number> = ref(10);
	const allFilters: Ref<Filters> = ref({});
	const isAlert: Ref<boolean> = ref(false);

	const fetchAllRecords = async (filters: Filters = {}) => {
		loading.value = true;
		error.value = null;
		allFilters.value = filters;
		const authStore = useAuthStore();

		if (!authStore.token) {
			error.value = 'Token is not available';
			loading.value = false;
			console.error(error.value);
			return;
		}

		try {
			const params = {
				page: filters.page || 1,
				per_page: itemsPerPage.value,
				sort: filters.sortBy ? `${filters.sortDesc ? '-' : ''}${filters.sortBy}` : undefined,
				...filters
			};

			const response = await axios.get<{ _meta: Meta; items: Record[] }>('https://phonebook.ddirection.kz/records', {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
				params,
			});

			totalRecords.value = response.data._meta.totalCount;
			totalPages.value = Math.ceil(response.data._meta.totalCount / itemsPerPage.value);
			records.value = response.data.items;
			itemsPerPage.value = response.data._meta.pageSize;
		} catch (err: any) {
			const axiosError = err as AxiosError;
			error.value = axiosError.message;
			console.error('Fetch records error:', axiosError);
		} finally {
			loading.value = false;
		}
	};

	const createRecord = async (record: Record) => {
		const authStore = useAuthStore();

		try {
			await axios.post('https://phonebook.ddirection.kz/records', record, {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
			});
			fetchAllRecords(allFilters.value);
		} catch (err: any) {
			const axiosError = err as AxiosError;
			error.value = axiosError.message;
			console.error('Create record error:', axiosError);
		} finally {
			isAlert.value = true;
			hideAlert();
		}
	};

	const updateRecord = async (record: Record) => {
		const authStore = useAuthStore();

		try {
			await axios.put(`https://phonebook.ddirection.kz/records/${record.id}`, record, {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
			});
			fetchAllRecords(allFilters.value);
		} catch (err: any) {
			const axiosError = err as AxiosError;
			error.value = axiosError.message;
			console.error('Update record error:', axiosError);
		} finally {
			isAlert.value = true;
			hideAlert();
		}
	};

	const deleteRecord = async (id: number) => {
		const authStore = useAuthStore();

		try {
			await axios.delete(`https://phonebook.ddirection.kz/records/${id}`, {
				headers: {
					Authorization: `Bearer ${authStore.token}`,
				},
			});
			fetchAllRecords(allFilters.value);
		} catch (err: any) {
			const axiosError = err as AxiosError;
			error.value = axiosError.message;
			console.error('Delete record error:', axiosError);
		} finally {
			isAlert.value = true;
			hideAlert();
		}
	};

	const hideAlert = () => {
		window.setTimeout(() => isAlert.value = false, 2500);
	};

	return { records, loading, error, fetchAllRecords, createRecord, updateRecord, deleteRecord, itemsPerPage, allFilters, totalPages, totalRecords, isAlert };
});
