<template>
  <div class="layout" id="app">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">E-Tickets 影院系统</div>
          <div class="layout-nav">
            <MenuItem name="1">
              <div @click="loginModal = true">
                {{ loginMsg }}
              </div>
            </MenuItem>
          </div>
        </Menu>
      </Header>
    <Layout>
      <Sider hide-trigger :style="{background: '#fff'}">
        <Menu :active-name="activePage" theme="light" width="auto">
          <router-link to="/">
          <MenuItem name="cinemaList">
            <Icon type="videocamera"></Icon>影院管理
          </MenuItem>
          </router-link>
        </Menu>
      </Sider>
      <Layout :style="{padding: '0 24px 24px'}">
        <Content :style="{padding: '5px', minHeight: '450px'}">
          <router-view/>
        </Content>
      </Layout>
    </Layout>
  </Layout>

    <div id="modal">
      <Modal
        v-model="loginModal"
        title="管理员登录"
        :loading="loading"
        okText="登录"
        @on-ok="ownerLogin"
        @on-cancel="cancelLogin">
        <div>
          <Form :model="loginForm" class="login-form">
            <FormItem prop="username">
              <Input type="text" v-model="loginForm.username" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="loginForm.password" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
  width: 200px;
  color: white;
  float: left;
  position: relative;
  font-size: 17px;

}
.layout-nav{
    width: 200px;
    margin: 0 auto;
    margin-right: 0px;
}

.login-form {
  padding: 0 40px;
}
</style>

<script>
import axios from 'axios'

export default {
  name: 'App',

  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },

      loginModal: false,

      loginMsg: '',

      currentUser: ''
      
    }
  },

  methods: {
    ownerLogin() {
      axios.post(`/api/session/owner`, {
        username: this.loginForm.username,
        password: this.loginForm.password
      })
      .then(res => {
        console.log(res.data)
        this.$Message.success(`Hello, ${res.data.data.username}`)
        this.currentUser = res.data.data.username
        console.log(this.currentUser)
        this.loginMsg = `Hello, ${res.data.data.username}`
        this.loginModal = false
        this.loginForm.username = ''
        this.loginForm.password = ''
      })
      .catch(err => {
        console.log(err)
        this.$Message.error(`登录失败`)
        this.loginModal = false
        this.loginForm.username = ''
        this.loginForm.password = ''
      })
    },

    cancelLogin() {
      this.loginForm.username = ''
      this.loginForm.password = ''
    }
  },

  created() {
    this.activePage = 'cinemaList'
    axios.get(`/api/owner/self`)
    .then(res => {
      this.currentUser = res.data.data.username
      console.log(this.currentUser)
      this.loginMsg = `Hello, ${res.data.data.username}`
    })
    .catch(res => {
      this.currentUser = ''
      this.loginMsg = `影院管理员登录`
    })
  }
}
</script>
