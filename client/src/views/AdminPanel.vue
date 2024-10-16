<template>
    <div class="adminContainer">
      <b-container class="adminPage">
      <h1 class="fontForTopText">Admin Panel</h1>
          <h2 class="fontForListName">Users:</h2>
          <div id="users-list">
            <div v-for="user in users"
                :key="user._id"
                class="user-container">
                <div id="userControls">
                    <h2 class="fontForUsersName">User: {{ user.username }}</h2>
                    <button @click="deleteUser(user._id)" class="delete-user-button">🗑️ Delete</button>
                </div>
                <p class="fontForUsersDescription">Password: {{ user.password }}</p>
                <p class="fontForUsersDescription">Streak: {{ user.streak }} 🔥</p>
            </div>
          </div>
        <button @click="deleteAllUsers" class="delete-all-users-button">🗑️ Delete All Users</button>
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
  }
}
</script>

<style scoped>
  h1 {
    font-family: 'InstrumentSerif', serif;
    font-size: 96px;
    color: #6A6A6A;
    margin-bottom: 20px;
  }

  .fontForListName {
    font-weight: bold;
    font-size: 32px;
    color: #6A6A6A;
    margin-bottom: 20px;
  }

  .adminContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
    min-height: 100vh;
  }

  .adminPage {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-style: none;
    background-color: #DEDBCC;
    width: 100%;
  }

  #users-list {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    gap: 20px;
    width: 50%;
  }

  .user-container {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 30px;
    background-color: #6A6A6A;
  }

  #userControls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .user-container h2,
    .fontForUsersName {
        font-weight: bold;
        color: white;
        margin: 0;
        font-size: 1.5em;
    }

  .user-container p,
    .fontForUsersDescription {
        font-size: large;
        color: white;
        margin: 5px 0;
    }

  .delete-all-users-button {
    font-weight: bold;
    padding: 1em;
    margin-left: 5px;
    margin-right: 5px;
    background-color: #EA9944;
  }

  .delete-user-button {
    font-weight: bold;
    padding: 0.5em;
    margin-left: 5px;
    margin-right: 5px;
    background-color: #EA9944;
  }
</style>
