<template>
  <div>
    <h1>Achievements</h1>
    <div id="achievements-list">
      <div v-for="achievement in achievements"
         :key="achievement._id"
         :class="{'achievement-completed': achievement.isTriggered, 'achievement': true}">
        <h2>Achievement: {{ achievement.name }}</h2>
        <p><strong>Condition:</strong> {{ achievement.condition }} </p>
        <button class="complete-button" @click="completeAchievement(achievement._id, achievement.isTriggered)">🏆 Complete</button>
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
    async completeAchievement(achievementId, isTriggered) {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('Failed to fetch user')
        return
      }
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
    }
  },
  mounted() {
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

  .achievement-completed {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #b2f2b2;
  }

  .achievement h2 {
    margin: 0;
    font-size: 1.5em;
  }

  .achievement p {
    margin: 5px 0;
  }
</style>
