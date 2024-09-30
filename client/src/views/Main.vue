<template>
  <div>
    <h1>Main Page</h1>
    <button @click="getAllDecks">Show decks info</button>
    <div v-if="deckInfo" class="deck">
      <li v-for="deck in deckInfo">
      <p>Name: {{ deck.name}}</p>
      <p>Deck ID: {{ deck._id}}</p>
      </li>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

export default {
  data() {
    return {
      deckId: '',
      deckName: '',
      deckInfo: null
    }
  },
  methods: {
    async getAllDecks() {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return router.push('/login')
      }
      try {
        const response = await axios.get(`/api/v1/users/${userId}/decks`)
        this.deckInfo = response.data.decks
        console.log('Get all decks:', response.data.decks)
      } catch (error) {
        console.error('Failed to get all decks:', error)
      }
    }
  }
}
</script>

<style>

</style>
