<template>
  <div>
  <img class="mainLogo" src="../assets/logos/mainLogo.svg" alt="Logo"/>
  <hr class="thick-separator-login-pc"/>
  <div class="pcScreen-container">
    <form class="registrationForm" @submit.prevent="register">
      <p class="signup-text">Sign Up</p>
      <label class="usernameLabel" for="username">username</label>
      <input class="usernameField" type="text" id="username" v-model="username" name="username" required>

      <label class="emailLabel" for="email">e-mail</label>
      <input class="emailField" type="email" id="email" v-model="email" name="email" required>

      <label class="passwordLabel" for="password">password</label>
      <input class="passwordField" type="password" id="password" v-model="password" name="password" required>

      <button class="signup-button" type="submit">Sign up</button>
      <p class="question-text">Already have an account?
        <router-link to="/login" class="login-link">Login</router-link>
      </p>
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

    </form>
    <hr class="thick-separator-login-mobile"/>
    <img class="booksLogo" src="../assets/logos/booksLogo.svg" alt="Logo"/>
  </div>
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
@media (max-width: 767px) {
  .signup-text {
    font-family: 'InstrumentSherif', serif;
    font-size: 50px;
    color: #6A6A6A;
  }

  .registrationForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2%;
  }

  .thick-separator-login-mobile, .thick-separator-login-pc {
    width: 90%;
    margin: 5% auto 5% auto;
    height: 3px;
    background-color: #6A6A6A;
    border: none;
  }

  .signup-button {
    width: 25%;
    font-size: 15px;
    margin-top: 4%;
    margin-bottom: 1%;
  }

  .login-link {
    color: #7CB6B2;
  }

  .booksLogo {
    display: block;
    margin-left: 10%;
    margin-top: 10%;
    width: 80%;
  }

  .mainLogo {
    display: block;
    width: 10%;
    margin-left: 45%;
    margin-top: 5%;
  }

  .error-text {
    text-align: center;
    color: #EA9944;
  }
}

@media (min-width: 768px ) {
  .mainLogo {
    margin: 1% 1% 1% 2.3%;
  }

  .thick-separator-login-pc {
    width: 95%;
    margin: 0 auto 0 auto;
    height: 3px;
    background-color: #6A6A6A;
    border: none;
  }

  .thick-separator-login-mobile {
    display: none;
  }

  .pcScreen-container {
    display: flex;
  }

  .registrationForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    margin-top: 6%;
  }

  .signup-text {
    font-family: 'InstrumentSherif', serif;
    font-size: 70px;
    color: #6A6A6A;
  }

  .usernameField, .emailField, .passwordField {
    width: 40%;
    height: 8%;
    border: 3px solid #6A6A6A;
  }

  .usernameLabel, .emailLabel, .passwordLabel {
    font-size: 20px;
    margin-top: 1%;
    margin-bottom: 1%;
  }

  .signup-button {
    width: 15%;
    height: 9%;
    font-size: 18px;
    margin-top: 3%;
    margin-bottom: 3%;
  }

  .login-link {
    color: #7CB6B2;
  }

  .question-text, .error-text {
    font-size: 22px;
  }

  .booksLogo {
    display: block;
    width: 40%;
    margin-top: 6%;
  }

  .error-text {
    text-align: center;
    color: #EA9944;
  }

}
</style>
