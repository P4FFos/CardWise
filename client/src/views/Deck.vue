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
        <button @click="deleteAllCards">Delete all cards</button>
        <ul>
            <li v-for="card in cardInfo" :key="card._id">
                <p>Card ID: {{ card._id }}</p>
                <p>Content: {{ card.content }}</p>
                <p>Explanation: {{ card.explanation }}</p>
                <button @click="toggleEditCard(card)">Edit Card</button>
                <button @click="deleteCard(card._id)">Delete card</button>

                <div v-if="editCardId === card._id">
                    <input type="text" v-model="editCardContent" placeholder="Enter new content for card">
                    <input type="text" v-model="editCardExplanation" placeholder="Enter new explanation for card">
                    <button @click="editCardInfo(card._id)">Submit</button>
                </div>
            </li>
        </ul>
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
      editCardContent: '',
      editCardExplanation: '',
      editCardId: null,
      editCard: false,
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
    async deleteCard(cardId) {
      const userId = localStorage.getItem('userId')
      try {
        await Api.delete(`/v1/users/${userId}/decks/${this.deckId}/cards/${cardId}`)
        this.cardInfo = this.cardInfo.filter(card => card._id !== cardId)
      } catch (error) {
        console.error('Failed to add new card:', error)
      }
    },
    async editCardInfo(cardId) {
      const userId = localStorage.getItem('userId')
      try {
        console.log(userId, this.deckId, cardId)
        console.log(this.editCardContent, this.editCardExplanation)
        const response = await Api.put(`/v1/users/${userId}/decks/${this.deckId}/cards/${cardId}`, {
          content: this.editCardContent,
          explanation: this.editCardExplanation
        })
        console.log('API response:', response)

        const updatedCard = response.data.card

        console.log(updatedCard)
        const cardIndex = this.cardInfo.findIndex(card => card._id === cardId)
        if (cardIndex !== -1) {
            this.cardInfo[cardIndex] = updatedCard
        }

        this.editCardId = null
        this.editCardContent = ''
        this.editCardExplanation = ''
      } catch (error) {
        console.error('Failed to edit card:', error)
      }
    },
    toggleEditCard(card) {
      this.editCardId = card._id
      console.log(card._id)
      console.log(this.editCardId)
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
    },
    async deleteAllCards() {
      const userId = localStorage.getItem('userId')

      try {
        await Api.delete(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.cardInfo = []
      } catch (error) {
        console.error('Failed to delete all decks:', error)
      }
    }
  }
}
</script>
