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
      streak: 0,
      lastLoginDate: new Date()
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
          this.lastLoginDate = new Date()

          const patch = await Api.put(`/v1/users/${user._id}`, {
            lastLoginDate: this.lastLoginDate
          })

          if (patch.status === 200) {
            await this.updateUserStreak(user)
            this.$router.push('/main')
          } else {
            this.errorMessage = 'Failed to update last login date'
          }
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

      this.streak = user.streak || 0

      if (!lastStreakDate) {
        this.streak = 1
      } else {
        const timeSinceLastStreak = currentDate - lastStreakDate
        if (timeSinceLastStreak <= oneDay && timeSinceLastStreak > 0) {
          this.streak += 1
        } else if (timeSinceLastStreak > oneDay) {
          this.streak = 1
        }
      }

      const milestones = [5, 15, 35, 50, 75, 100]

      for (const milestone of milestones) {
        if (this.streak === milestone) {
          await this.completeAchievement(user._id, `s${milestone}`)
        }
      }

      try {
        await Api.put(`/v1/users/${user._id}`, {
          lastStreakDate: currentDate,
          streak: this.streak
        })
      } catch (error) {
        console.error('Failed to update user streak:', error)
      }
    },
    async completeAchievement(userId, achievementCode) {
      try {
        await Api.put(`/v1/users/${userId}/achievements/${achievementCode}`, {
          completed: true
        })
        console.log(`Achievement ${achievementCode} completed!`)
      } catch (error) {
        console.error(`Failed to complete achievement ${achievementCode}:`, error)
      }
    }
  }
}
</script>

<style>
</style>
