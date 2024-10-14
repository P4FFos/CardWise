<template>
    <div class="deckWithCards">
      <div id="deckName">
        <p>
          {{ this.deckName }}
        </p>
      </div>
      <div class="createCardContainer">
          <router-link id="backToMainPage" :to="{ name: 'main'}">
            <button>
              Go Back
            </button>
          </router-link>
          <label for="cardContent">Name:</label>
          <input type="text" id="cardContent" v-model="cardContent" placeholder="Enter card name">
          <label for="cardExplanation">Explanation:</label>
          <input type="text" id="cardExplanation" v-model="cardExplanation" placeholder="Enter card explanation">
          <button @click="addNewCard">Add +</button>
        </div>
        <ul class="allCards">
          <li v-for="card in cardInfo" :key="card._id" class="card">
            <p id="cardName">{{ card.content }}</p>
            <p>{{ card.explanation }}</p>
            <div class="changeCard">
              <button @click="toggleEditCard(card)">Edit Card</button>
              <button @click="deleteCard(card._id)">Delete card</button>
            </div>
            <div v-if="editCardId === card._id">
              <input type="text" v-model="editCardContent" placeholder="Enter new content for card">
              <input type="text" v-model="editCardExplanation" placeholder="Enter new explanation for card">
              <button @click="editCardInfo(card._id)">Submit</button>
            </div>
          </li>
        </ul>
        <div class="bottomButtonsContainer">
          <router-link :to="{ name: 'practice', params: { deckId: this.deckId } }">
            <button>
              Go to Practice Mode
            </button>
          </router-link>
          <button id="deleteAllCardsButton" @click="deleteAllCards">Delete all cards</button>
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
      editCardContent: '',
      editCardExplanation: '',
      editCardId: null,
      editCard: false,
      cardInfo: [],
      showCards: false,
      deckName: null,
      links: []
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

        // complete achievement t2
        const deckData = await Api.get(`/v1/users/${userId}/decks/${this.deckId}`)
        const deck = deckData.data.deck
        if (deck.cardAmount >= 42) {
          await Api.put(`/v1/users/${userId}/achievements/t2`, {
            completed: true
          })
        }
      } catch (error) {
        console.error('Failed to add new card:', error)
      }
    },
    async getDeckName() {
      const userId = localStorage.getItem('userId')
      try {
        const deckData = await Api.get(`/v1/users/${userId}/decks/${this.deckId}`)
        this.deckName = deckData.data.deck.name
      } catch (error) {
        console.error('Failed to get the name of the deck: ', error)
      }
    },
    async deleteCard(cardId) {
      const userId = localStorage.getItem('userId')
      try {
        await Api.delete(`/v1/users/${userId}/decks/${this.deckId}/cards/${cardId}`)
        this.cardInfo = this.cardInfo.filter(card => card._id !== cardId)
      } catch (error) {
        console.error('Failed to delete the card:', error)
      }
    },
    async getSpecCard() {
      const userId = localStorage.getItem('userId')
      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}/cards/${this.editCardId}`)
        this.links = response.data._links
      } catch (error) {
        console.error('Failed to get specific card:', error)
      }
    },
    async editCardInfo(cardId) {
      const userId = localStorage.getItem('userId')
      await this.getSpecCard()
      try {
        const editUrl = this.links.edit.href
        const response = await Api.put(editUrl, {
          content: this.editCardContent,
          explanation: this.editCardExplanation
        })
        // complete achievement t5
        await Api.put(`/v1/users/${userId}/achievements/t5`, {
          completed: true
        })
        const updatedCard = response.data.card

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
    },
    async getAllCards() {
      const userId = localStorage.getItem('userId')

      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.cardInfo = response.data.deck.cards
        this.showCards = true
      } catch (error) {
        console.error('Failed to get all cards:', error)
      }
    },
    async deleteAllCards() {
      const userId = localStorage.getItem('userId')

      try {
        await Api.delete(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.cardInfo = []
      } catch (error) {
        console.error('Failed to delete all cards:', error)
      }
    }
  },
  mounted() {
    this.getAllCards()
    this.getDeckName()
  }
}
</script>

<style scoped>

.deckWithCards {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#deckName {
  align-self: center;
}

#deckName p {
  font-size: larger;
}

.createCardContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.allCards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  justify-items: center;
  overflow-y: auto;
  max-height: 360px;
  border-style: double;
  align-items: center;
  margin: 25px;
  padding: 10px;
}

.card {
  background-color: #6A6A6A;
  min-width: 250px;
  max-width: 200px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  border-radius: 5%;
}

.changeCard {
  margin-top: auto;
}

.card p{
  color: white;
}

#cardName {
  font-size: larger;
}

.bottomButtonsContainer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

#deleteAllCardsButton {
  margin: 20px;
}

@media (max-width: 768px) {
 .allCards {
  grid-template-columns: repeat(1, 1fr);
  width: 280px;
  max-height: none;
  justify-content: center;
  align-self: center;
 }

 .createCardContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  }

 
}

</style>
