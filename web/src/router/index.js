import Vue from 'vue'
import Router from 'vue-router'
import v_canvas from '@/components/canvas'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'v_canvas',
      component: v_canvas
    },
  ]
})
