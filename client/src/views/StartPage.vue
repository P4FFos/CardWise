<template>
  <div class="content-container">
    <div class="button-container">
      <button @click="goToLogin">Login</button>
      <button @click="goToSignup">Sign up</button>
    </div>
    <hr class="thick-separator" />
    <img src="@/assets/startPageLogo.svg" alt="Icon" />
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

.content-container {
  text-align: center;
}

.button-container {
  margin: 15px;
  text-align: right;
}

button {
  width: 150px;
}

.thick-separator {
  border: none;
  height: 3px;
  width: 98%;
  margin: auto auto;
  background-color: #1b1b1b;
}

.content-container img {
  margin: 10% auto 0 auto;
  width: 90%;
}

@media (max-width: 450px) {
  .button-container {
    margin: 30px auto auto auto;
    text-align: center;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    width: 300px;
  }

  .content-container img {
    order: 1;
    margin: 50px auto auto auto;

  }

  .button-container {
    order: 3;
  }

  .thick-separator {
    order: 2;
    width: 90%;
    margin: 50px auto auto auto;
  }
}

@media (max-width: 1024px) {
  .button-container {
    text-align: center;
  }
}
</style>
