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
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
      errorMessage: ''
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

        const user = await axios.get(`/api/v1/users/${this.userId}`)
        console.log('Get the user:', user.data.user)
        this.$router.push('/login')
      } catch (error) {
        this.errorMessage = 'Registration failed'
      }
    }
  }
}
</script>

<style>

</style>
