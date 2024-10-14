<template>
  <div class="main">
    <div>
      <img class="main-logo" src="../assets/logos/mainLogo.svg" alt="Logo"/>
      <hr class="thick-separator-loginPC"/>
    </div>
    <div class="pc-login-form">
      <form class="login-form" @submit.prevent="login">
        <p class="login-text">Log in</p>
        <label class="username-label" for="username">username</label>
        <input class="username-field" type="text" id="username" v-model="username" name="username" required>

        <label class="password-label" for="password">password</label>
        <input class="password-field" type="password" id="password" v-model="password" name="password" required>

        <button class="login-button" type="submit">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      <hr class="thick-separator-loginMobile"/>
      <img class="handsWithTextLogo" src="../assets/logos/handsWithText.svg" alt="Logo"/>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api.js'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      streak: 0,
      lastLoginDate: new Date()
    }
  },
  methods: {
    async login() {
      try {
        const response = await Api.get('/v1/users')
        const users = response.data
        const user = users.find(user => user.username === this.username && user.password === this.password)

        const responseAdmin = await Api.get('/v1/admins')
        const admins = responseAdmin.data
        const admin = admins.find(admin => admin.username === this.username && admin.password === this.password)

        if (user) {
          localStorage.setItem('userId', user._id)
          this.lastLoginDate = new Date()

          const patch = await Api.put(`/v1/users/${user._id}`, {
            lastLoginDate: this.lastLoginDate
          })

          if (patch.status === 200) {
            await this.updateUserStreak(user)
            this.$router.push('/main')
          } else {
            this.errorMessage = 'Failed to update last login date'
          }
        } else {
          this.errorMessage = 'Invalid username or password'
        }

        if (admin) {
          localStorage.setItem('adminID', admin._id)
          this.$router.push('/admin-panel')
        } else {
          this.errorMessage = 'Invalid username or password'
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while trying to login'
      }
    },
    async updateUserStreak(user) {
      const currentDate = new Date()
      const lastStreakDate = new Date(user.lastStreakDate || 0)

      const oneDay = 24 * 60 * 60 * 1000

      this.streak = user.streak || 0

      if (!lastStreakDate) {
        this.streak = 1
      } else {
        const timeSinceLastStreak = currentDate - lastStreakDate
        if (timeSinceLastStreak <= oneDay && timeSinceLastStreak > 0) {
          this.streak += 1
        } else if (timeSinceLastStreak > oneDay) {
          this.streak = 1
        }
      }

      const milestones = [5, 15, 35, 50, 75, 100]

      for (const milestone of milestones) {
        if (this.streak === milestone) {
          await this.completeAchievement(user._id, `s${milestone}`)
        }
      }

      try {
        await Api.put(`/v1/users/${user._id}`, {
          lastStreakDate: currentDate,
          streak: this.streak
        })
      } catch (error) {
        console.error('Failed to update user streak:', error)
      }
    },
    async completeAchievement(userId, achievementCode) {
      try {
        await Api.put(`/v1/users/${userId}/achievements/${achievementCode}`, {
          completed: true
        })
        console.log(`Achievement ${achievementCode} completed!`)
      } catch (error) {
        console.error(`Failed to complete achievement ${achievementCode}:`, error)
      }
    }
  }
}
</script>

<style>
@media (max-width: 767px) {
  .login-text {
    font-family: 'InstrumentSherif', serif;
    font-size: 50px;
    color: #6A6A6A;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .thick-separator-loginPC, .thick-separator-loginMobile {
    width: 90%;
    margin: 5% auto 5% auto;
    height: 3px;
    background-color: #6A6A6A;
    border: none;
  }

  .login-button {
    width: 20%;
    margin-top: 4%;
    margin-bottom: 1%;
  }

  .handsWithTextLogo {
    display: block;
    margin-left: 14%;
    margin-top: 15%;
    width: 80%;
  }

  .main-logo {
    display: block;
    width: 10%;
    margin-left: 45%;
    margin-top: 5%;
  }

  .error-message {
    text-align: center;
    color: #EA9944;
  }
}

@media (min-width: 768px) {
  .main-logo {
    margin: 1% 1% 1% 2.3%;
  }

  .thick-separator-loginPC {
    width: 95%;
    margin: 0 auto 0 auto;
    height: 3px;
    background-color: #6A6A6A;
    border: none;
  }

  .thick-separator-loginMobile {
    display: none;
  }

  .pc-login-form {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .login-form {
    order: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    margin-top: 6%;
  }

  .login-text {
    font-family: 'InstrumentSherif', serif;
    font-size: 70px;
    color: #6A6A6A;
  }

  .username-field, .password-field {
    width: 40%;
    height: 6%;
    border: 3px solid #6A6A6A;
  }

  .username-label, .password-label {
    margin-top: 1%;
    margin-bottom: 1%;
  }

  .login-button {
    width: 15%;
    height: 6%;
    margin-top: 3%;
    margin-bottom: 3%;
  }

  .handsWithTextLogo {
    order: 1;
    width: 55%;
  }

  .error-message {
    text-align: center;
    color: #EA9944;
  }
}
</style>
