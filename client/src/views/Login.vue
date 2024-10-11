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
      errorMessage: '',
      streak: 0
    }
  },
  methods: {
    async login() {
      try {
        const response = await Api.get('/v1/users')
        const users = response.data
        const user = users.find(user => user.username === this.username && user.password === this.password)

        const responseAdmin = await Api.get('/v1/admins')
        const admins = responseAdmin.data
        const admin = admins.find(admin => admin.username === this.username && admin.password === this.password)

        if (user) {
          localStorage.setItem('userId', user._id)
          this.$router.push('/main')
          await this.updateUserStreak(user)
        } else {
          this.errorMessage = 'Invalid username or password'
        }

        if (admin) {
          localStorage.setItem('adminID', admin._id)
          this.$router.push('/admin-panel')
        } else {
          this.errorMessage = 'Invalid username or password'
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while trying to login'
      }
    },
    async updateUserStreak(user) {
      const currentDate = new Date()
      const lastStreakDate = new Date(user.lastStreakDate || 0)

      const oneDay = 24 * 60 * 60 * 1000
      const timeSinceLastStreak = currentDate - lastStreakDate

      let streak = user.streak || 0

      if (timeSinceLastStreak <= oneDay) {
        streak += 1
      } else if (timeSinceLastStreak > oneDay) {
        streak = 1
      }

      //   if (streak === 5) {
      //     await Api.put(`/v1/users/${user._id}/achievements/s1`, {
      //       completed: true
      //     })
      //   }

      try {
        await Api.patch(`/v1/users/${user._id}`, {
          lastLoginDate: currentDate,
          lastStreakDate: currentDate,
          streak
        })
      } catch (error) {
        console.error('Failed to update user streak:', error)
      }
    }
  }
}
</script>

<style>
</style>
