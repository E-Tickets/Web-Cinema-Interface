<template>
    <div>
      <cinema-list :cinemas-data="cinemasData"></cinema-list>
    </div>
</template>

<style scoped>

</style>


<script>
import axios from 'axios'

import cinemaList from '../components/cinemaList.vue'

export default {
  data() {
    return {
      currentUser: '',

      cinemasData: []
    }
  },

  components: {
    'cinema-list': cinemaList,
  },

  created() {
    axios.get(`/api/owner/self`)
    .then(res => {
      this.currentUser = res.data.data.username
      return axios.get(`/api/cinemas/owner/${this.currentUser}`)
    })
    .then(res => {
      this.cinemasData = res.data.data
      this.$Message.success(`获取影院列表`)
    })
    .catch(err => {
      if (err.response.status === 401) {
        this.$Message.warning(`检测到您还未登录，请先登录`)
        console.log(err.response.data)
      } else {
        this.$Message.warning(`未找到任何影院`)
        console.log(err.response.data)
      }
    })
  }
}
</script>
