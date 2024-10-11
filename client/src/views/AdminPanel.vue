<template>
    <div>
      <h1>Admin Panel</h1>
      <div class="panel">
        <h2>Users</h2>
        <div id="list">
          <div v-for="user in users"
              :key="user._id"
              class="container">
              <h2>User: {{ user.username }}</h2>
              <p>Password: {{ user.password }}</p>
              <button @click="deleteUser(user._id)" class="button">🗑️ Delete</button>
          </div>
        </div>
      </div>
      <button @click="deleteAllUsers" class="button">🗑️ Delete All Users</button>
    </div>
  </template>

<script>
import { Api } from '@/Api.js'

export default {
  name: 'Achievements',
  data() {
    return {
      type: '',
      testName: '',
      streakName: '',
      condition: '',
      streakCounter: 0,
      achievements: [],
      users: []
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await Api.get('/v1/users')
        if (response.data && Array.isArray(response.data)) {
          this.users = response.data
        } else {
          console.log('No users found')
        }
      } catch (error) {
        alert('Failed to fetch users: ' + error.message)
      }
    },
    async fetchAchievements() {
      const response = await Api.get('/v1/achievements')
      try {
        if (response.data && Array.isArray(response.data.achievements)) {
          this.achievements = response.data.achievements
        } else {
          console.log('No achievements found')
        }
      } catch (error) {
        alert('Failed to fetch achievements: ' + error.message)
      }
    },
    async deleteUser(userId) {
      try {
        await Api.delete(`/v1/users/${userId}`)
        console.log(`User ${userId} was deleted`)
        alert('User was deleted')
        this.users = this.users.filter(user => user._id !== userId)
      } catch (error) {
        alert('Failed to delete user: ' + error.message)
      }
    },
    async deleteAllUsers() {
      try {
        await Api.delete('/v1/users')
        alert('All user accounts deleted successfully')
        this.users = []
      } catch (error) {
        alert('Failed to delete all users: ' + error.message)
      }
    }
  },
  mounted() {
    this.fetchUsers()
    this.fetchAchievements()
  }
}
</script>

<style>
  #list {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    gap: 20px;
    width: 50%;
  }

  .container {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #f9f9f9;
  }

  .achievement-completed {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #b2f2b2;
  }

  .container h2 {
    margin: 0;
    font-size: 1.5em;
  }

  .container p {
    margin: 5px 0;
  }

  .panel {
    border: 2px solid #6c6c6c;
    padding: 0px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
  }

  .button {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
