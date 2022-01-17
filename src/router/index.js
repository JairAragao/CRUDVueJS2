import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Tarefas',
    component: () => import('../views/Tarefas.vue')
  },
  {
    path: '/Sobre',
    name: 'Sobre',
    component: () => import('../views/Sobre.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
