<template>
  <div class="achievementsContainer">
    <p class="goToMain" @click="goToMain"> Go back</p>
    <img class="goBackIcon" @click="goToMain" src="../assets/icons/backButton.svg" alt="Logo"/>
    <b-container class="achievementsPage">
    <h1 class="fontForTopText">Achievements</h1>
      <div id="achievements-list">
        <div class="achievement" v-for="achievement in this.achievements"
           :key="achievement._id"
           :class="{'achievement-completed': achievement.completed, 'achievement': true}">
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
        } else {
          alert('No achievements found')
        }
      } catch (error) {
        alert('Failed to fetch achievements: ' + error.message)
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
  .goBackIcon{
     display: none;
  }

  h1 {
    font-family: 'InstrumentSerif', serif;
    font-size: 96px;
    color: #6A6A6A;
    margin-bottom: 20px;
  }

  .achievement{
    width: 95%;
  }

  .achievementsContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
    min-height: 100vh;
    position: fixed;
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
    overflow-y: auto;
    max-height: 520px;
  }

  .achievement {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 15px;
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
    font-size: 30px;
    font-weight: 600;
    color: #363529;
    margin: 1.5% 3% 1% 3%;
    text-align: left;
  }

/* Responsive Styling */
@media (max-width: 995px) {
    h1 {
      font-size: 64px;
    }

    .achievementsPage {
      width: 100%;
    }

    .goBackIcon{
       display: block;
      position: absolute;
      top: 10px;
      left: 10px;
      width: 10%;
    }

    #achievements-list {
      width: 100%;
      max-height: 640px;
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
