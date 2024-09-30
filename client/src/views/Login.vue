<template>
  <div>
    <h1>Login Page</h1>
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="username" name="username" required>

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" name="password" required>

      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div v-if="userInfo">
      <p>User Information</p>
      <p>Username: {{ userInfo.username }}</p>
      <p>Email: {{ userInfo.email }}</p>
      <p>User Id: {{userInfo._id}}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      userInfo: null,
      userId: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.get('/api/v1/users')
        const users = response.data
        const user = users.find(user => user.username === this.username && user.password === this.password)

        if (user) {
          this.userInfo = user
          localStorage.setItem('userId', user._id)
          this.$router.push('/main')
        } else {
          this.errorMessage = 'Invalid username or password'
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while trying to login'
      }
    },
    showUserInfo() {
    }
  }
}
</script>

<style>
</style>
