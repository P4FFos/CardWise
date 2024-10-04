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
      <div class="panel">
        <h2>Achievements</h2>
        <div>
        <p>create test achievement</p>
        <form @submit.prevent="createTestAchievement">

        <label for="testName">Name:</label>
        <input type="text" id="testName" v-model="testName" name="testName" required>

        <label for="condition">Condition: </label>
        <input type="text" id="condition" v-model="condition" name="condition" required>

        <button type="submit">Create</button>
        </form>

        <p>create streak achievement</p>
        <form @submit.prevent="createStreakAchievement">

        <label for="streakName">Name:</label>
        <input type="text" id="streakName" v-model="streakName" name="streakName" required>

        <label for="streakCounter">Streak Counter: </label>
        <input type="number" id="streakCounter" v-model="streakCounter" name="streakCounter" required>

        <button type="submit">Create</button>
        </form>
      </div>
      <div id="achievements-list">
        <div v-for="achievement in achievements"
           :key="achievement._id"
           :class="{'achievement-completed': achievement.completed, 'container': true}">
          <h2>Achievement: {{ achievement.name }}</h2>
          <p><strong>Condition: </strong> {{ achievement.condition || achievement.streakCounter }} </p>
          <button @click="deleteAchievement(achievement._id)" class="button">🗑️ Delete</button>
        </div>
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
    async createTestAchievement() {
      try {
        const response = await Api.post('/v1/achievements', {
          type: 'TestAchievement',
          name: this.testName,
          condition: this.condition
        })

        const newAchievement = response.data.achievement
        console.log('New Global Achievement:', newAchievement)
        await this.fetchUsers()
        if (this.users && Array.isArray(this.users)) {
          for (const user of this.users) {
            await Api.post(`/v1/users/${user._id}/achievements/${newAchievement._id}`, {
              achievement: newAchievement._id,
              completed: false
            })
          }
        }
        this.achievements.push(newAchievement)
      } catch (error) {
        alert('Failed to create achievement: ' + error.message)
      }
    },
    async createStreakAchievement() {
      const userId = localStorage.getItem('userId')
      if (userId) {
        try {
          const response = await Api.post('/v1/achievements', {
            type: 'StreakAchievement',
            name: this.streakName,
            streakCounter: this.streakCounter
          })

          const newAchievement = response.data.achievement
          console.log('New Global Achievement:', newAchievement)
          await this.fetchUsers()
          if (this.users && Array.isArray(this.users)) {
            for (const user of this.users) {
              await Api.post(`/v1/users/${user._id}/achievements/${newAchievement._id}`, {
                achievement: newAchievement._id,
                completed: false
              })
            }
          }
          this.achievements.push(newAchievement)
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
        await Api.delete(`/v1/achievements/${achievementId}`)
        console.log(`Global achievement ${achievementId} was deleted`)
        await this.fetchUsers()
        if (this.users && Array.isArray(this.users)) {
          for (const user of this.users) {
            try {
              await Api.delete(`/v1/users/${user._id}/achievements/${achievementId}`)
            } catch (error) {
              if (error.response && error.response.status === 404) {
                console.warn(`User ${user._id} does not have achievement ${achievementId}.`)
              } else {
                alert('Failed to delete user achievement: ' + error.message)
              }
            }
          }
        }
        alert('Achievement deleted successfully')
        this.achievements = this.achievements.filter(achievement => achievement._id !== achievementId)
      } catch (error) {
        alert('Failed to delete global achievement: ' + error.message)
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
