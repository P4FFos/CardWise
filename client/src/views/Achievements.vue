<template>
  <div class="achievementsContainer">
    <p class="goToMain" @click="goToMain"> Go back</p>
    <b-container class="achievementsPage">
    <h1 class="fontForTopText">Achievements</h1>
      <div id="achievements-list">
        <div v-for="achievement in this.achievements"
           :key="achievement._id"
           :class="{'achievement-completed': achievement.completed, 'container': true}">
          <h2 class="fontForAchievementsName">Achievement: {{ achievement.name }}</h2>
          <p class="fontForAchievementsText"><strong>Condition: {{ achievement.description }} </strong></p>
        </div>
      </div>
    </b-container>
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
    async completeAchievement(achievementId) {
      const userID = localStorage.getItem('userId')
      if (!userID) {
        alert('Failed to fetch user')
        return
      }
      try {
        await Api.put(`/v1/users/${userID}/achievements/${achievementId}`, {
          completed: true
        })
        console.log(`Achievement ${achievementId} completed`)
        const achievement = this.achievements.find(a => a._id === achievementId)
        if (achievement) {
          achievement.completed = true
        }
        alert('achievement completed')
      } catch (error) {
        alert('Failed to complete achievement: ' + error.message)
      }
    },
    goToMain() {
      this.$router.push({ name: 'main' })
    }
  },
  mounted() {
    this.fetchAchievements()
  }
}
</script>

<style scoped>
  .achievementsContainer, .go-back {
      -moz-osx-font-smoothing: grayscale;
  }

  h1 {
    font-family: 'InstrumentSerif', serif;
    font-size: 96px;
    color: #6A6A6A;
    margin-bottom: 20px;
  }

  .achievementsContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
    min-height: 100vh;
  }

  .achievementsPage {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-style: none;
    background-color: #DEDBCC;
    width: 100%;
  }

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
    border-radius: 30px;
    background-color: #6A6A6A;
  }

  .achievement-completed {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 15px;
    background-color: #68bd76;
  }

  .achievement h2,
    .fontForAchievementsName{
        font-weight: bold;
        color: white;
        margin: 0;
        font-size: 1.5em;
    }

  .achievement p,
    .fontForAchievementsText {
        font-size: large;
        color: white;
    }

  .goToMain{
    font-size: 24px;
    font-weight: 600;
    color: #363529;
    margin: 1.5% 3% 1% 4%;
    text-align: left;
  }

/* Responsive Styling */
@media (max-width: 768px) {
    h1 {
      font-size: 64px;
    }

    .achievementsPage {
      width: 100%;
    }

    #achievements-list {
      width: 100%;
      padding: 0 10px;
    }

    .achievement,
    .achievement-completed {
      width: 100%;
      box-sizing: border-box;
    }

    .fontForAchievementsText {
      font-size: medium;
    }

    .fontForAchievementsName {
      font-size: large;
    }

    .goToMain {
        display: none;
    }
  }
</style>
