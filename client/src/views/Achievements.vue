<template>
  <div>
    <h1>Achievements</h1>
    <div>
      <p>dev-function: create test achievement</p>
      <form @submit.prevent="createTestAchievement">

      <label for="name">Name:</label>
      <input type="text" id="name" v-model="name" name="name" required>

      <label for="condition">Condition:</label>
      <input type="text" id="condition" v-model="condition" name="condition" required>

      <button type="submit">Register</button>
      </form>

      <p>create streak achievement</p>
      <form @submit.prevent="createStreakAchievement">

      <label for="name">Name:</label>
      <input type="text" id="name" v-model="name" name="name" required>

      <label for="streakCounter">streakCounter:</label>
      <input type="number" id="streakCounter" v-model="streakCounter" name="streakCounter" required>

      <button type="submit">Register</button>
      </form>
    </div>
    <div id="achievements-list">
      <div v-for="achievement in achievements" :key="achievement._id" class="achievement">
        <h2>Achievement: {{ achievement.name }}</h2>
        <p><strong>Condition:</strong> {{ achievement.condition }} </p>
        <button class="complete-button" @click="completeAchievement(achievement._id, achievement.isTriggered)">👍</button>
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
      achievements: []
    }
  },
  methods: {
    async fetchAchievements() {
      const userId = localStorage.getItem('userId')
      console.log('UserId: ' + userId)
      if (userId) {
        const response = await axios.get(`/api/v1/users/${userId}/achievements`)
        try {
          this.achievements = Array.isArray(response.data) ? response.data : []
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
        const response = await axios.post(`/api/v1/users/${userId}/achievements`, {
          type: 'TestAchievement',
          name: this.name,
          isTriggered: this.isTriggered,
          condition: this.condition,
          achievementId: this._id
        })
        console.log('New Achievement name: ' + response.data.achievement.name + ' New Achievement condition: ' + response.data.achievement.condition)
        try {
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
        const response = await axios.post(`/api/v1/users/${userId}/achievements`, {
          type: 'StreakAchievement',
          name: this.name,
          isTriggered: this.isTriggered,
          streakCounter: this.streakCounter,
          achievementId: this._id
        })
        console.log('New Achievement name: ' + response.data.achievement.name + ' New Achievement counter: ' + response.data.achievement.streakCounter)
        try {
          this.achievements.push(response.data.achievement)
        } catch (error) {
          alert('Failed to create achievement: ' + error.message)
        }
      } else {
        alert('Failed to fetch user')
      }
    },
    async completeAchievement(achievementId, isTriggered) {
      const userId = localStorage.getItem('userId')
      const apiUrl = `/api/v1/users/${userId}/achievements/${achievementId}`
      console.log('PATCH request to:', apiUrl)
      if (userId) {
        try {
          const updatedIsTriggered = !isTriggered
          const response = await axios.put(`/api/v1/users/${userId}/achievements/${achievementId}`, {
            isTriggered: updatedIsTriggered
          })
          console.log(`Achievement ${achievementId} completed: ${updatedIsTriggered}`)
          const achievement = this.achievements.find(a => a._id === achievementId)
          if (achievement) {
            achievement.isTriggered = updatedIsTriggered
          }
          alert('achievement completed')
        } catch (error) {
          alert('Failed to complete achievement: ' + error.message)
        }
      } else {
        alert('Failed to fetch user')
      }
    }
  },
  beforeMount() {
    this.fetchAchievements()
  }
}
</script>

<style>
  #achievements-list {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    gap: 20px;
    width: 50%;
  }

  .achievement {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #f9f9f9;
  }

  .achievement h2 {
    margin: 0;
    font-size: 1.5em;
  }

  .achievement p {
    margin: 5px 0;
  }
</style>
