<template>
    <div>
        <div>Deck page showing cards</div>
        <div>
          <label for="cardContent">Card content:</label>
          <input type="text" id="cardContent" v-model="cardContent" placeholder="Enter card name">
          <label for="cardExplanation">Card explanation:</label>
          <input type="text" id="cardExplanation" v-model="cardExplanation" placeholder="Enter card explanation">
          <button @click="addNewCard">Add new card</button>
        </div>
        <button @click="getAllCards">Show cards info</button>
        <div v-if="showCards">
            <ul>
                <li v-for="card in cardInfo" :key="card._id">
                    <p>Deck ID: {{ card._id }}</p>
                    <p>Content: {{ card.content }}</p>
                    <p>Explanation: {{ card.explanation }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Api } from '@/Api.js'

export default {
  props: {
    deckId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cardContent: '',
      cardExplanation: '',
      cardInfo: [],
      showCards: false
    }
  },
  methods: {
    async addNewCard() {
      const userId = localStorage.getItem('userId')
      try {
        const newCard = { content: this.cardContent, explanation: this.cardExplanation }
        const response = await Api.post(`/v1/users/${userId}/decks/${this.deckId}/cards`, newCard)
        const addedCard = response.data.card
        this.cardInfo.push(addedCard)

        console.log(addedCard)
      } catch (error) {
        console.error('Failed to add new card:', error)
      }
    },
    async getAllCards() {
      const userId = localStorage.getItem('userId')

      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.cardInfo = response.data.deck.cards
        console.log(this.cardInfo)
        this.showCards = true
      } catch (error) {
        console.error('Failed to get all decks:', error)
      }
    }
  }
}
</script>
