import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
import { useRecordsStore } from './records';

export const useAuthStore = defineStore('auth', () => {
	const isAuthenticated = ref(false);
	const token = ref<string | null>(null);
	const refreshTokenInterval = ref<number | null>(null);
	const loading = ref(false);

	const login = async (email: string, password: string) => {
		try {
			loading.value = true;
			const response = await axios.post('https://phonebook.ddirection.kz/auth/signin', { email, password });
			if (response.data.access_token) {
				token.value = response.data.access_token;
				isAuthenticated.value = true;
				axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
				setRefreshTokenInterval();

				const recordsStore = useRecordsStore();
				await recordsStore.fetchAllRecords();
			} else {
				throw new Error('Token not received');
			}
		} catch (error: any) {
			if (error.response) {
				console.error('Login failed:', error.response.data);
			} else {
				console.error('Login failed:', error.message);
			}
			throw new Error('Invalid credentials');
		} finally {
			loading.value = false;
			await router.push('/');
		}
	};

	const logout = () => {
		isAuthenticated.value = false;
		token.value = null;
		delete axios.defaults.headers.common['Authorization'];
		router.push('/login');
	};

	const refreshToken = async () => {
		try {
			const response = await axios.post('https://phonebook.ddirection.kz/auth/refresh', null, {
				headers: {
					'Authorization': `Bearer ${token.value}`
				}
			});
			if (response.data.access_token) {
				token.value = response.data.access_token;
				axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
			} else {
				throw new Error('Token not received');
			}
		} catch (error: any) {
			if (error.response) {
				console.error('Token refresh failed:', error.response.data);
			} else {
				console.error('Token refresh failed:', error.message);
			}
			logout();
		}
	};

	const setRefreshTokenInterval = () => {
		clearRefreshTokenInterval();
		refreshTokenInterval.value = window.setInterval(refreshToken, 5 * 60 * 1000);
	};

	const clearRefreshTokenInterval = () => {
		if (refreshTokenInterval.value) {
			clearInterval(refreshTokenInterval.value);
			refreshTokenInterval.value = null;
		}
	};

	return { isAuthenticated, token, login, logout, refreshToken, loading };
});
