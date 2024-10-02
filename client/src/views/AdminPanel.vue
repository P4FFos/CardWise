<template>
    <div>
      <h1>Admin Panel</h1>
      <div class="panel">
        <h2>Users</h2>
        <div id="list">
          <div v-for="user in users"
              :key="user._id"
              class="container">
              <h2>User: {{ user.name }}</h2>
              <button @click="deleteUser(user._id)">🗑️ Delete</button>
          </div>
      </div>
      </div>
      <div class="panel">
        <h2>Achievements</h2>
        <div>
        <p>create test achievement</p>
        <form @submit.prevent="createTestAchievement">

        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" name="name" required>

        <label for="condition">Condition: </label>
        <input type="text" id="condition" v-model="condition" name="condition" required>

        <button type="submit">Create</button>
        </form>

        <p>create streak achievement</p>
        <form @submit.prevent="createStreakAchievement">

        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" name="name" required>

        <label for="streakCounter">Streak Counter: </label>
        <input type="number" id="streakCounter" v-model="streakCounter" name="streakCounter" required>

        <button type="submit">Create</button>
        </form>
      </div>
      <div id="achievements-list">
        <div v-for="achievement in achievements"
           :key="achievement._id"
           :class="{'achievement-completed': achievement.isTriggered, 'container': true}">
          <h2>Achievement: {{ achievement.name }}</h2>
          <p><strong>Condition:</strong> {{ achievement.condition }} </p>
          <button @click="deleteAchievement(achievement._id)">🗑️ Delete</button>
        </div>
      </div>
      </div>
    </div>
  </template>

<script>
import axios from 'axios'

// specify the base URL for the API server
axios.defaults.baseURL = 'http://localhost:3000'

export default {
  name: 'Achievements',
  data() {
    return {
      type: '',
      name: '',
      isTriggered: false,
      condition: '',
      streakCounter: 0,
      achievements: [],
      users: []
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/v1/users')
        if (response.data && Array.isArray(response.data.users)) {
          this.users = response.data.users
        } else {
          console.log('No users found')
        }
      } catch (error) {
        alert('Failed to fetch users: ' + error.message)
      }
    },
    async fetchAchievements() {
      const userId = localStorage.getItem('userId')
      if (userId) {
        try {
          const response = await axios.get(`/api/v1/users/${userId}/achievements`)
          if (response.data && Array.isArray(response.data.achievements)) {
            this.achievements = response.data.achievements
          } else {
            console.log('No achievements found')
          }
        } catch (error) {
          alert('Failed to fetch achievements: ' + error.message)
        }
      } else {
        alert('Failed to fetch user')
      }
    },
    async createTestAchievement() {
      const userId = localStorage.getItem('userId')
      if (userId) {
        try {
          const response = await axios.post(`/api/v1/users/${userId}/achievements`, {
            type: 'TestAchievement',
            name: this.name,
            isTriggered: this.isTriggered,
            condition: this.condition
          })
          console.log('New Achievement:', response.data.achievement)
          this.achievements.push(response.data.achievement)
        } catch (error) {
          alert('Failed to create achievement: ' + error.message)
        }
      } else {
        alert('Failed to fetch user')
      }
    },
    async createStreakAchievement() {
      const userId = localStorage.getItem('userId')
      if (userId) {
        try {
          const response = await axios.post(`/api/v1/users/${userId}/achievements`, {
            type: 'StreakAchievement',
            name: this.name,
            isTriggered: this.isTriggered,
            streakCounter: this.streakCounter
          })
          console.log('New Achievement:', response.data.achievement)
          this.achievements.push(response.data.achievement)
        } catch (error) {
          alert('Failed to create achievement: ' + error.message)
        }
      } else {
        alert('Failed to fetch user')
      }
    },
    async deleteAchievement(achievementId) {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('Failed to fetch user')
        return
      }
      try {
        const response = await axios.delete(`/api/v1/users/${userId}/achievements/${achievementId}`)
        console.log(`Achievement ${achievementId} was deleted`)
        alert('achievement deleted')
        this.achievements = this.achievements.filter(achievement => achievement._id !== achievementId)
      } catch (error) {
        alert('Failed to delete achievement: ' + error.message)
      }
    },
    async deleteUser(userId) {
      try {
        const response = await axios.delete(`/api/v1/users/${userId}`)
        console.log(`User ${userId} was deleted`)
        alert('User was deleted')
        this.users = this.users.filter(user => user._id !== userId)
      } catch (error) {
        alert('Failed to delete user: ' + error.message)
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
</style>
