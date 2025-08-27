import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LevelvisuellView from '@/views/LevelvisuellView.vue'
import Level1CompleteView from '@/views/Level1CompleteView.vue'
import LevelmultimodalView from '@/views/LevelmultimodalView.vue'
import LevelohneFeedbackView from '@/views/LevelohneFeedbackView.vue'
import Level2CompleteView from '@/views/Level2CompleteView.vue'
import Level3CompleteView from '@/views/Level3CompleteView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Bestehende einzelne Level (für Backup/Demo)
    {
      path: '/level-1',
      name: 'level-1',
      component: LevelvisuellView,
    },
    { path: '/level-1-complete',
      name: 'level-1-complete',
      component: Level1CompleteView,
    },
    { path: '/level-2',
      name: 'level-2',
      component: LevelmultimodalView,
    },
    { path: '/level-2-complete',
      name: 'level-2-complete',
      component: Level2CompleteView,
    },
    { path: '/level-3',
      name: 'level-3',
      component: LevelohneFeedbackView,
    },
    { path: '/level-3-complete',
      name: 'level-3-complete',
      component: Level3CompleteView,
    },
    // Fallback route für unbekannte Pfade
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
