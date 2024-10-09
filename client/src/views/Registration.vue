<template>
  <div class="loginPage-container">
    <img class="mainLogo" src="../assets/logos/mainLogo.svg" alt="Logo" />
    <form class="registrationForm" @submit.prevent="register">
      <p class="signup-text">Sign Up</p>
      <label class="usernameLabel" for="username">username</label>
      <input class="usernameField" type="text" id="username" v-model="username" name="username" required>

      <label class="emailLabel" for="email">e-mail</label>
      <input class="emailField" type="email" id="email" v-model="email" name="email" required>

      <label class="passwordLabel" for="password">password</label>
      <input class="passwordField" type="password" id="password" v-model="password" name="password" required>

      <button class="signup-button" type="submit">Sign up</button>
      <p>Already have an account? <router-link to="/login" class="login-link">Login</router-link></p>
    </form>
    <hr class="thick-separator-login" />
    <img class="booksLogo" src="../assets/logos/booksLogo.svg" alt="Logo" />
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { Api } from '@/Api.js'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await Api.post('/v1/users', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        const userId = response.data.user._id
        localStorage.setItem('userId', userId)
        this.$router.push('/login')
      } catch (error) {
        this.errorMessage = error.response.data.message
      }
    }
  }
}
</script>

<style>
@media (min-width: 320px) {
  .loginPage-container {
    text-align: center;
  }

  .signup-text {
    font-family: 'InstrumentSherif', serif;
    font-size: 50px;
    color: #6A6A6A;
  }

  .registrationForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
  }

  .thick-separator-login {
    width: 90%;
    margin: 0 auto 0 auto;
    height: 3px;
    background-color: #1b1b1b;
  }

  .signup-button {
    width: 25%;
    font-size: 15px;
    margin-top: 15px;
  }

  .login-link {
    color: #7CB6B2;
  }

  .booksLogo {
    display: block;
    margin-left: 10%;
    margin-top: 50px;
    width: 80%;
  }

  .mainLogo {
    display: none;
  }
}

@media (min-width: 760px ) {
  .mainLogo{
    display: block;
    width: 8%;
    margin-left: 46%;
    margin-top: 15px;
  }
  .registrationForm {
    margin-top: 5px;
  }

  .booksLogo {
    width: 50%;
    margin-left: 25%;
  }

  .signup-button {
    width: 18%;
  }

  .usernameLabel, .usernameField, .emailLabel, .emailField, .passwordLabel, .passwordField {
    width: 35%;
  }
}

@media (min-width: 1024px) {

}
</style>
