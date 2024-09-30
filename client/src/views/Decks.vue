<template>
    <div>
        <h1>Work for the love of god</h1>
        <h2>hjihgoge</h2>
        <button @click="goToHome()">Back</button>
        <p v-for="card in cards" v-bind:key="card">{{ card.cardName }}</p>
        <form @submit.prevent="createDeck">
            <h3>Create a new deck</h3>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
            <input type="submit" value="Create Deck">
        </form>
        <button @click="showDeckInfo">Show Deck Info</button>
        <div v-if="deckInfo">
          <p>Deck Information</p>
          <p>Id: {{ deckInfo.deckId }}</p>
          <p>Name: {{ deckInfo.name }}</p>
          <p>Cards: {{ deckInfo.cards }}</p>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src

import { Api } from '@/Api'

export default {
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  name: 'decks',
  data() {
    return {
      username: '',
      password: '',
      deckInfo: null,
      deckId: '',
      userId: '',
      name: '',
      cards: []
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    },
    createDeck() {
      const deckData = {
        name: this.name,
        cards: this.cards
      }
      if (!this.userId) {
        console.error('User id is not available. Create user fist')
        return
      }
      const endPoint = `/v1/users/${this.userInfo._id}/decks`

      Api.post(endPoint, deckData)
        .then(response => {
          console.log('Deck created: ', response.data)
          this.deckId = response.data.deck._id
        }).catch(error => {
          console.error('There was an error while creating the deck: ', error)
        })
    },
    showDeckInfo() {
      Api.get(`/v1/users/${this.userId}/decks/${this.deckId}`)
        .then(response => {
          this.deckInfo = response.data.deck
        }).catch(error => {
          alert('Failed to get deck info: ' + error.message)
        })
    }
  }
}
</script>
