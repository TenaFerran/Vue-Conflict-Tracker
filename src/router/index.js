import { createRouter, createWebHistory } from 'vue-router'
import ConflictsView from '@/views/ConflictsView.vue'
import ConflictDetailView from '@/views/ConflictDetailView.vue'
import Home from "@/views/Home.vue";
import ConflictForm from '@/components/ConflictForm.vue';

const routes = [
  {
      path: "/",
      name: "home",
      component: Home,
    },
  {
    path: '/conflicts',
    name: 'conflicts',
    component: ConflictsView
  },
  {
    path: '/conflicts/:id',
    name: 'conflict-detail',
    component: ConflictDetailView,
    props: true
  },
   {
    path: '/Form',
    name: 'form',
    component: ConflictForm,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router