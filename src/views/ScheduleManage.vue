<template>
  <div class="schedule-manage">
    <div>
      <Row>
        <Col span="8">
          <h2>影院：{{ cinemaInfo.cinema_name }}</h2>
        </Col>
        <Col span="12">
          <h2>开放影厅：
            <span v-for="item in cinemaHallsInfo" v-bind:key="item.hall_id">
              {{ item.hall_id }}
            </span>
          </h2>
        </Col>
        <Col span="4">
          <div class="manage-btn-area">
            <Button type="success" @click="createScheduleModal=true">增加排片</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <movie-schedule-list :schedules-data="schedulesDataPage" @deleteSchedule="deleteSchedule"></movie-schedule-list>
      </Row>
      <Row>
        <div class="page-area">
          <Page :total="schedulesAmount" :current="currentPage" @on-change="pageChange" show-elevator></Page>
        </div>
      </Row>
    </div>
    <div>
      <Modal
        v-model="createScheduleModal"
        title="新增排片"
        :loading="true"
        @on-ok="createSchedule"
        @on-cancel="cancel">
        <Row>
          <Col span="8">
            <Table :columns="moviesCol" :data="moviesInfo">
            </Table>
          </Col>
          <Col span="15" offset="1">
            <Form :model="scheduleForm" label-position="right" :label-width="60">
              <FormItem label="电影">
                <Input v-model="scheduleForm.movieTitle"></Input>
              </FormItem>
              <FormItem label="影厅">
                <Input v-model="scheduleForm.movieHall"></Input>
              </FormItem>
              <FormItem label="时间">
                <Row>
                  <Col span="11">
                    <FormItem prop="date">
                      <DatePicker type="date" placeholder="Select date" v-model="scheduleForm.date"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="11">
                    <FormItem prop="time">
                      <TimePicker type="time" format="HH:mm" placeholder="Select time" v-model="scheduleForm.time"></TimePicker>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="票价">
                <Input v-model="scheduleForm.price"></Input>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
.manage-btn-area {
  text-align: right
}

.page-area {
  margin-top: 20px;
}
</style>

<script>
import axios from 'axios'

import movieScheduleList from '../components/movieScheduleList.vue'

export default {
  data() {
    return {
      cinemaInfo: {},
      cinemaHallsInfo: [],
      schedulesInfo: [],
      moviesInfo: [],
      createScheduleModal: false,

      currentUser: '',

      movieMap: {},

      scheduleForm: {
        movieTitle: '',
        movieHall: '',
        date: '',
        time: '',
        price: 80
      },

      currentPage: 1,

      moviesCol: [
        {
          title: '正在热映',
          key: 'title'
        }
      ]
    }
  },

  computed: {
    createScheduleData() {
      let movieId
      if (this.movieMap[this.scheduleForm.movieTitle]) {
        movieId = this.movieMap[this.scheduleForm.movieTitle].movie_id
      } else {
        movieId = -1
      }

      let hourMin = this.scheduleForm.time.split(':')
      let date = new Date(this.scheduleForm.date)
      date.setHours(parseInt(hourMin[0]), parseInt(hourMin[1]))
      return {
        movieId: movieId,
        movieHall: parseInt(this.scheduleForm.movieHall),
        time: this.formatDate(date),
        price: parseInt(this.scheduleForm.price)
      }
    },
 
    schedulesDataPage() {
      let start = (this.currentPage - 1) * 10

      return this.schedulesInfo.map(item => {
        item.title = this.movieMap[item.movie_id].title
        item.tags = this.movieMap[item.movie_id].tags
        .reduce((x, y) => {
          return x + ',' + y
        })

        return item
      }).slice(start, start + 10)
    },

    schedulesAmount() {
      return this.schedulesInfo.length
    },
  },

  methods: {
    createSchedule() {
      console.log(this.createScheduleData)
      if (this.createScheduleData.movieId !== -1
          && this.createScheduleData.movieHall > 0
          && this.createScheduleData.price > 0) {
        
        axios.post(`/api/schedule`, {
          username: this.currentUser,
          cinema_id: this.cinemaInfo.cinema_id,
          movie_id: this.createScheduleData.movieId,
          hall_id: this.createScheduleData.movieHall,
          time: this.createScheduleData.time,
          price: this.createScheduleData.price
        })
        .then(res => {
          console.log(res)
          let scheduleData = res.data.data
          console.log(scheduleData)
          this.schedulesInfo.push(scheduleData)
          this.$Message.success(res.data.message)

          this.clearScheduleForm()
          this.createScheduleModal = false
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
          this.createScheduleModal = false
        })
      } else {
        this.$Message.error('字段不合法')
        this.createScheduleModal = false
      }
    },

    pageChange(page) {
      this.currentPage = page
    },

    clearScheduleForm() {
      this.scheduleForm = {
        movieTitle: '',
        movieHall: '',
        time: '',
        price: ''
      }
    },

    deleteSchedule(index) {
      let schedule = this.schedulesDataPage[index]
      console.log({
        username: this.currentUser,
        cinema_id: this.cinemaInfo.cinema_id
      })
      axios.delete(`/api/schedule/${schedule.schedule_id}`, {
        data: {
          username: this.currentUser,
          cinema_id: this.cinemaInfo.cinema_id
        }
      })
      .then(res => {
        let tmpList = []

        for (let scheduleItem of this.schedulesInfo) {
          if (scheduleItem.schedule_id !== schedule.schedule_id) {
            tmpList.push(scheduleItem)
          }
        }

        this.schedulesInfo = tmpList
        this.$Message.success(res.data.message)
      })
      .catch(err => {
        this.$Message.error(err.response.data.message)
      })
    },

    formatDate(date) {
      let dateArray = []
      dateArray.push(date.getFullYear() + '')
      dateArray.push((date.getMonth() + 1) + '')
      dateArray.push(date.getDate() + '')
      dateArray.push(date.getHours() + '')
      dateArray.push(date.getMinutes() + '')
      
      dateArray = dateArray.map((str) => {
        if (str.length < 2) {
            str = '0' + str
        }
        return str
      })

      let dateStr = dateArray[0] + '-' + dateArray[1] + '-'
          + dateArray[2] + ' ' + dateArray[3] + ':' + dateArray[4]
      return dateStr
    }
  },

  components: {
    'movie-schedule-list': movieScheduleList
  },

  created() {
    this.currentPage = 1
    
    axios.get(`/api/movies/status/1`)
    .then(res => {
      this.moviesInfo = res.data.data.movies
      this.movieMap = {}
      for (let movie of this.moviesInfo) {
        this.movieMap[movie.movie_id] = movie
        this.movieMap[movie.title] = movie
      }
      return axios.get(`/api/cinema/${this.$route.params.cinema_id}`)
    })
    .then(res => {
      this.cinemaInfo = res.data.data

      return axios.get(`/api/cinema/${this.$route.params.cinema_id}/moviehalls`)
    })
    .then(res => {
      this.cinemaHallsInfo = res.data.data

      return axios.get(`/api/schedules/cinemaid/${this.$route.params.cinema_id}`)
    })
    .then(res => {
      this.schedulesInfo = res.data.data

      return axios.get(`/api/owner/self`)
    })
    .then(res => {
      this.currentUser = res.data.data.username
    })
    .catch(err => {
      if (err.response.status === 404) {
        this.$Message.warning(err.response.data.message)
      } else {
        this.$Message.error(err.response.data.message)
      }
    })
  }
}
</script>
