<template>
  <div class="startPage-container">
    <div class="button-container">
      <button class="loginButton" @click="goToLogin">Login</button>
      <button class="signupButton" @click="goToSignup">Sign up</button>
    </div>
    <hr class="thick-separator" />
    <img class="startPage-logo-pc" src="../assets/logos/startPageLogoPc.svg" alt="Logo" />
    <img class="startPage-logo-mobile" src="../assets/logos/startPageLogoMobile.svg" alt="Logo" />
  </div>
</template>

<script>
export default {
  name: 'start-page',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'login' })
    },
    goToSignup() {
      this.$router.push({ name: 'registration' })
    }
  }
}
</script>

<style>

@media (max-width: 767px) {
  .button-container {
    order: 4;
    margin-top: 30px;
    width: 90%;
    text-align: center;
  }

  .startPage-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .loginButton, .signupButton {
    width: 250px;
    height: 40px;
  }

  .startPage-logo-mobile {
    display: block;
    order: 1;
    margin-top: 100px;
    margin-bottom: 30px;
    width: 90%;
  }

  .startPage-logo-pc {
    display: none;
  }

  .thick-separator {
    order: 3;
    width: 90%;
    height: 3px;
    background-color: #6A6A6A;
    border: none;
  }
}

@media (min-width: 768px) {
  .startPage-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button-container {
    order: 1;
    width: 95%;
    text-align: right;
    margin-top: 16px;
  }

  .loginButton, .signupButton {
    width: 150px;
    height: 50px;
  }

  .thick-separator {
    order: 2;
    width: 95%;
    height: 3px;
    background-color: #6A6A6A;
    border: none;
  }

  .startPage-logo-pc {
    width: 86%;
    order: 3;
    margin-top: 8%;
  }

  .startPage-logo-mobile {
    display: none;
  }
}
</style>
