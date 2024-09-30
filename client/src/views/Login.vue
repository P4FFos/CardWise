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
  </div>
</template>

<script>
import { Api } from '@/Api.js'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await Api.get('/v1/users')
        const users = response.data
        const user = users.find(user => user.username === this.username && user.password === this.password)

        if (user) {
          localStorage.setItem('userId', user._id)
          this.$router.push('/main')
        } else {
          this.errorMessage = 'Invalid username or password'
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while trying to login'
      }
    }
  }
}
</script>

<style>
</style>
