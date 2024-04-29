import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import QueueCaller from "../views/CallQueue.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/queue-caller",
    name: "queue-caller",
    component: QueueCaller,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
