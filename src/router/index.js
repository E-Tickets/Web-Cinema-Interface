import Vue from 'vue'
import Router from 'vue-router'
import CinemaManage from '../views/CinemaManage.vue'
import ScheduleManage from '../views/ScheduleManage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'cinema-manage',
      component: CinemaManage
    },

    {
      path: '/schedule/cinema/:cinema_id',
      name: 'schedule-manage',
      component: ScheduleManage
    }
  ]
})
