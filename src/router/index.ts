import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import BillList from '@/views/bill-list/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BillList,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
