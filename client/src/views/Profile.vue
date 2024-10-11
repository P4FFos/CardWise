<template>
  <div>
    <h1>User Profile</h1>
    <p>Username: {{ user.username }}</p>
    <p>Email: {{ user.email }}</p>
    <p>Last Login: {{ user.lastLoginDate }}</p>
    <p>Registration Date: {{ user.registrationDate }}</p>
    <p>Streak: {{ user.streak }}</p>
    <div>
      <form @submit.prevent="updateUsername">
        <label for="username">New Username:</label>
        <input type="text" id="username" v-model="newUsername" required>
        <button type="submit">Update Username</button>
      </form>
    </div>

    <div>
      <form @submit.prevent="updateEmail">
        <label for="email">New Email:</label>
        <input type="email" id="email" v-model="newEmail" required>
        <button type="submit">Update Email</button>
      </form>
    </div>

    <div>
      <form @submit.prevent="updatePassword">
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" v-model="newPassword" required>
        <button type="submit">Update Password</button>
      </form>
    </div>

    <button @click="deleteAccount">Delete Account</button>
    <button @click="backToMain">Main Page</button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { Api } from '@/Api.js'

export default {
  data() {
    return {
      user: {
        username: '',
        email: '',
        lastLoginDate: new Date(),
        registrationDate: new Date(),
        streak: 0
      },
      newUsername: '',
      newEmail: '',
      newPassword: '',
      errorMessage: '',
      successMessage: '',
      links: {}
    }
  },
  methods: {
    async getUserData() {
      try {
        const userId = localStorage.getItem('userId')
        const response = await Api.get(`/v1/users/${userId}`)

        this.user = {
          ...response.data.user,
          lastLoginDate: new Date(response.data.user.lastLoginDate).toLocaleString(),
          registrationDate: new Date(response.data.user.registrationDate).toLocaleString(),
        }
        this.links = response.data._links
        this.newEmail = this.user.email
        this.newUsername = this.user.username

        console.log('last login date: ', response.data.user)
      } catch (error) {
        this.errorMessage = 'Failed to get user data'
      }
    },
    async updateUsername() {
      try {
        const updateUrl = this.links['update username'].href
        await Api.patch(updateUrl, { username: this.newUsername })

        this.successMessage = 'Username updated successfully'
        this.getUserData()
      } catch (error) {
        this.errorMessage = 'Failed to update username'
      }
    },
    async updateEmail() {
      try {
        const updateUrl = this.links.update.href
        await Api.put(updateUrl, { email: this.newEmail })

        this.successMessage = 'Email updated successfully'
        this.getUserData()
      } catch (error) {
        this.errorMessage = 'Failed to update email'
      }
    },
    async updatePassword() {
      try {
        const updateUrl = this.links.update.href
        await Api.put(updateUrl, { password: this.newPassword })

        this.successMessage = 'Password updated successfully'
        this.getUserData()
      } catch (error) {
        this.errorMessage = 'Failed to update password'
      }
    },
    async deleteAccount() {
      try {
        const userId = localStorage.getItem('userId')
        await Api.delete(`/v1/users/${userId}`)

        localStorage.removeItem('userId')
        this.$router.push('/registration')
      } catch (error) {
        this.errorMessage = 'Failed to delete account'
      }
    },
    backToMain() {
      this.$router.push('/main')
    }
  },
  mounted() {
    this.getUserData()
  }
}
</script>

<style>

</style>
