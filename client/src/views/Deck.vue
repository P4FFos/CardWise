<template>
    <div class="deckWithCards">
      <div class="topLevelContainer">
        <img class="mainLogoDeck" @click="goToMain" src="../assets/logos/mainLogo.svg" alt="Logo"/>
      </div>
      <hr class="thick-separator-deck-pc"/>
      <div id="deckName">
        <p>
          Deck name: {{ this.deckName }}
        </p>
      </div>
      <div class="createCardContainer">
        <div id="cardContentContainer">
          <label for="cardContent">Name </label>
          <input type="text" id="cardContent" v-model="cardContent" placeholder="Enter card name">
        </div>
        <div id="cardExplanationContainer">
          <label for="cardExplanation">Explanation</label>
          <input type="text" id="cardExplanation" v-model="cardExplanation" placeholder="Enter card explanation">
        </div>
        <button class="addButton" @click="addNewCard">Add +</button>
        </div>
        <ul class="allCards">
          <li v-for="card in cardInfo" :key="card._id" class="card">
            <p id="cardName">{{ card.content }}</p>
            <p>{{ card.explanation }}</p>
            <div class="changeCard">
              <button class="editCardButton" @click="toggleEditCard(card)">Edit Card</button>
              <button class="deleteCardButton" @click="deleteCard(card._id)">Delete card</button>
            </div>
            <div v-if="editCardId === card._id">
              <input type="text" v-model="editCardContent" placeholder="Enter new name...">
              <input type="text" v-model="editCardExplanation" placeholder="Enter new explanation...">
              <button class="submitButton" @click="editCardInfo(card._id)">Submit</button>
            </div>
          </li>
        </ul>
        <div class="bottomButtonsContainer">
          <router-link :to="{ name: 'practice', params: { deckId: this.deckId } }">
            <button class="goToPracticeButton">
              Practice Mode
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
        alert('Failed to add new card')
      }
    },
    async getDeckName() {
      const userId = localStorage.getItem('userId')
      try {
        const deckData = await Api.get(`/v1/users/${userId}/decks/${this.deckId}`)
        this.deckName = deckData.data.deck.name
      } catch (error) {
        alert('Failed to get the name of the deck')
      }
    },
    async deleteCard(cardId) {
      const userId = localStorage.getItem('userId')
      try {
        await Api.delete(`/v1/users/${userId}/decks/${this.deckId}/cards/${cardId}`)
        this.cardInfo = this.cardInfo.filter(card => card._id !== cardId)
      } catch (error) {
        alert('Failed to delete the card')
      }
    },
    async getSpecCard() {
      const userId = localStorage.getItem('userId')
      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}/cards/${this.editCardId}`)
        this.links = response.data._links
      } catch (error) {
        alert('Failed to get specific card')
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
        alert('Failed to edit card')
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
        alert('Failed to get all cards')
      }
    },
    async deleteAllCards() {
      const userId = localStorage.getItem('userId')

      try {
        await Api.delete(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.cardInfo = []
      } catch (error) {
        alert('Failed to delete all cards')
      }
    },
    goToMain() {
      this.$router.push({ name: 'main' })
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
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 5px;
}

.topLevelContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0;
}

.editCardButton, .deleteCardButton, .submitButton, .addButton {
  width: 100px;
  height: 35px;
  margin-bottom: 10px;
}

.mainLogoDeck {
  margin: 10px 1% 1% 2.3%;
  width: 4%;
}

.thick-separator-deck-pc {
  width: 95%;
  margin: 0 auto 0 auto;
  height: 3px;
  background-color: #6A6A6A;
  border: none;
}

#deckName {
  align-self: center;
  margin-top: 20px;
}

#deckName p {
  font-size: 50px;
  font-family: 'InstrumentSerif', serif;
}

.createCardContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: center;
}

.allCards {
  display: grid;
  align-self: center;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  justify-items: center;
  align-items: center;
  overflow-y: auto;
  flex-grow: 1;
  width: 60vw;
  max-height: 390px;
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  border:none;
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
  border-radius: 30px;
}

#cardExplanationContainer, #cardContentContainer {
  margin-left: 10px;
  margin-right: 40px;
}

label {
  margin-right: 5px;
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
  align-self: center;
  justify-content: flex-end;
}

#deleteAllCardsButton, .goToPracticeButton {
  margin: 15px;
  width: 150px;
  height: 40px;
}

@media (max-width: 768px) {
  .thick-separator-deck-pc{
    height: 3px;
    width: 90%;
  }

  .mainLogoDeck {
    display: block;
    width: 10%;
    margin: 4% 0 4% 45%;
  }

  .addButton {
    margin-top: 10px;
    width: 100px;
    height: 35px;
  }

  .allCards {
    grid-template-columns: repeat(1, 1fr);
    width: 290px;
    height: 390px;
    justify-content: center;
    align-self: center;
  }

 .createCardContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #cardExplanationContainer, #cardContentContainer {
    margin-right: 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
  }

  label {
    text-align: center;
  }

  #deckName {
    margin-top: 10%;
  }

  #deckName p {
    font-size: 40px;
  }

  .bottomButtonsContainer {
    justify-content: center;
  }
}

</style>
