import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListView from '../views/ListView.vue'
import SeriesView from '../views/SeriesView.vue'
import DetailView from '../views/DetailView.vue'
import PublishView from '../views/PublishView.vue'
import StoryView from '../views/StoryView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/list/:id',
    name: 'list',
    component: ListView
  },
  {
    path: '/series/:brandId/:seriesId',
    name: 'series',
    component: SeriesView
  },
  {
    path: '/detail/:brandId/:seriesId',
    name: 'detail',
    component: DetailView
  },
  {
    path: '/publish',
    name: 'publish',
    component: PublishView
  },
  {
    path: '/story',
    name: 'story',
    component: StoryView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
