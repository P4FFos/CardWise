<template>
    <div class="profile-container">
    <p class="goToMain" @click="goToMain"> Go back</p>
      <img class="faceLogo" src="../assets/logos/face-profile.svg" alt="Logo"/>

      <div class="profile-content">
        <h1>{{ user.username }}</h1>
        <p class="fontForMainInfo"><strong>Streak</strong> {{ user.streak }} 🔥</p>

        <h2 class="fontForHeadingText">Personal Details</h2>
        <p class="fontForMainInfo"><strong>E-mail: </strong> {{ user.email }}</p>
        <p class="fontForMainInfo"><strong>Last Login: </strong> {{ user.lastLoginDate }}</p>
        <p class="fontForRegularText">Account was created on {{ user.registrationDate }}</p>

        <h2 class="fontForHeadingText">Edit Profile</h2>
        <div>
          <form @submit.prevent="updateUsername">
            <label for="username" class="fontForMainInfo">New Username:</label>
            <input type="text" id="username" v-model="newUsername" required>
            <button type="submit" class="button">Update Username</button>
          </form>
        </div>

        <div>
          <form @submit.prevent="updateEmail">
            <label for="email" class="fontForMainInfo">New Email:</label>
            <input type="email" id="email" v-model="newEmail" required>
            <button type="submit" class="button">Update Email</button>
          </form>
        </div>

        <div>
          <form @submit.prevent="updatePassword">
            <label for="newPassword" class="fontForMainInfo">New Password:</label>
            <input type="password" id="newPassword" v-model="newPassword" required>
            <button type="submit" class="button">Update Password</button>
          </form>
        </div>

        <button @click="deleteAccount" class="delete-account-button">Delete Account</button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </div>
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
          registrationDate: new Date(response.data.user.registrationDate).toLocaleString()
        }
        this.links = response.data._links
        this.newEmail = this.user.email
        this.newUsername = this.user.username
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
    goToMain() {
      this.$router.push('/main')
    }
  },
  mounted() {
    this.getUserData()
  }
}
</script>

<style scoped>
  h1 {
    font-size: 64px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .profile-content h2,
  fontForHeadingText {
    font-weight: bold;
    margin: 0;
    margin-bottom: 1em;
    font-size: 2em;
  }

  p, .fontForMainInfo {
    color: #363529;
  }

  p, .fontForRegularText {
    color: #6A6A6A;
  }

  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .faceLogo {
    max-height: 80%;
    margin-right: 20%;
  }

  .profile-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    max-width: 600px;
    text-align: left;
  }

  .goToMain{
    font-size: 30px;
    font-weight: 600;
    color: #363529;
    margin: 1.5% 3% 1% 4%;
    text-align: left;
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .delete-account-button {
    font-weight: bold;
    padding: 0.75em;
    margin-left: 5px;
    margin-right: 5px;
    background-color: #EA9944;
  }

  .button {
    padding: 0.5em;
    margin-left: 5px;
    margin-right: 5px;
  }

  label {
    margin-bottom: 5px;
    margin-right: 20px;
    font-weight: bold;
  }

  h2, p {
    margin: 10px 0;
  }

  form {
    margin-bottom: 20px;
  }

  button {
    margin-right: 10px;
  }

  .error-message {
    text-align: center;
    color: #EA9944;
  }

  .success-message {
    color: #009179;
  }

  @media (max-width: 1195px) {
    .faceLogo {
      display: none;
    }
  }

  @media (max-width: 995px) {
    .profile-content {
      width: 100%;
    }

    .fontForMainInfo {
      font-size: medium;
    }

    .fontForAchievementsName {
      font-size: large;
    }

    .goToMain {
        display: none;
    }
  }

  @media (max-width: 500px) {
    .profile-content {
      width: 100%;
      display: flex;
      align-items: center;
    }

    form {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    label {
      margin-bottom: 5px;
    }

    input {
      margin-bottom: 10px;
      padding: 5px;
      width: 100%;
      max-width: 400px;
    }
  }
</style>
