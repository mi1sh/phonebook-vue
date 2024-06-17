import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const LoginPage = () => import('@/pages/LoginPage.vue');
const LayoutPage = () => import('@/pages/LayoutPage.vue');

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: LoginPage,
	},
	{
		path: '/',
		name: 'Layout',
		component: LayoutPage,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to: any, from: any, next: any) => {
	const authStore = useAuthStore();
	if (to.matched.some((record: any) => record.meta.requiresAuth) && !authStore.isAuthenticated) {
		next({ name: 'Login' });
	} else {
		next();
	}
});

export default router;
