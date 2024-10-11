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
import { Api } from '@/Api.js'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
      lastLoginDate: new Date(),
      registrationDate: new Date()
    }
  },
  methods: {
    async register() {
      console.log('username: ', this.username)
      try {
        const response = await Api.post('/v1/users', {
          username: this.username,
          email: this.email,
          password: this.password,
          lastLoginDate: new Date(),
          registrationDate: new Date()
        })
        const userId = response.data.user._id
        localStorage.setItem('userId', userId)
        this.$router.push('/login')
      } catch (error) {
        this.errorMessage = error.response.data.message
      }
    }
  }
}
</script>

<style>

</style>
