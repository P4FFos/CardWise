<template>
  <div>
    <h1>Achievements</h1>
    <div id="achievements-list">
      <div v-for="achievement in this.achievements"
           :key="achievement._id"
           :class="{'achievement-completed': achievement.completed, 'container': true}">
          <h2>Achievement: {{ achievement.achievement.name }}</h2>
          <p><strong>Condition: </strong> {{ achievement.achievement.condition || achievement.achievement.streakCounter }} </p>
        <button class="complete-button" @click="completeAchievement(achievement._id, achievement.completed)">🏆 Complete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api.js'

export default {
  name: 'Achievements',
  data() {
    return {
      type: '',
      name: '',
      condition: '',
      completed: false,
      streakCounter: 0,
      achievements: []
    }
  },
  methods: {
    async fetchAchievements() {
      try {
        const userID = localStorage.getItem('userId')

        const response = await Api.get(`/v1/users/${userID}/achievements`)

        if (response.data && Array.isArray(response.data.achievements)) {
          this.achievements = response.data.achievements
          console.log(this.achievements)
        } else {
          console.log('No achievements found')
        }
      } catch (error) {
        alert('Failed to fetch achievements: ' + error.message)
      }
    },
    async completeAchievement(achievementId, completed) {
      const userID = localStorage.getItem('userId')
      if (!userID) {
        alert('Failed to fetch user')
        return
      }
      try {
        const updatedCompleted = !completed
        await Api.put(`/v1/users/${userID}/achievements/${achievementId}`, {
          completed: updatedCompleted
        })
        console.log(`Achievement ${achievementId} completed: ${updatedCompleted}`)
        const achievement = this.achievements.find(a => a._id === achievementId)
        if (achievement) {
          achievement.completed = updatedCompleted
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
