<template>
  <div>
    <h1>Registration Page</h1>
    <form @submit.prevent="register">
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="username" name="username" required>

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" name="email" required>

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" name="password" required>

      <button type="submit">Register</button>
    </form>
    <button @click="showUserInfo">Show User Info</button>
    <div v-if="userInfo">
      <p>User Information</p>
      <p>Username: {{ userInfo.username }}</p>
      <p>Email: {{ userInfo.email }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// specify the base URL for the API server
axios.defaults.baseURL = 'http://localhost:3000'

export default {
  name: 'Registration',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      userInfo: null,
      userId: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('/api/v1/users', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        this.userId = response.data.user._id
        alert('User successfully registered')
      } catch (error) {
        alert('Registration failed: ' + error.message)
      }
    },
    async showUserInfo() {
      try {
        const response = await axios.get(`/api/v1/users/${this.userId}`)
        this.userInfo = response.data.user
      } catch (error) {
        alert('Failed to get user info: ' + error.message)
      }
    }
  }
}
</script>

<style>

</style>
