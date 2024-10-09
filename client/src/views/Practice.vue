<template>
    <div class="practiceContainer">
      <b-container class="practicePage">
        <h1>Practice Mode</h1>
        <div v-if="currentCard">
            <b-row class="practiceCard" >
              <b-col >
                <p class="cardText" v-if="!showExplanation"> {{ currentCard.content }}</p>
                <p class="cardText" v-else>{{ currentCard.explanation }}</p>
                <button class="practiceButtons" v-if="!showExplanation" @click="showExplanation = true">
                  <p>
                    Explanation
                  </p>
                </button>
                <div class="difficultyButtonsBox" v-else>
                  <button class="practiceButtons" @click="handleCard('easy')">Easy</button>
                  <button class="practiceButtons" @click="handleCard('hard')">Hard</button>
                </div>
              </b-col>
            </b-row>
          </div>
          <p>Cards Left: {{ this.practiceCards.length + 1 }}</p>
          <p>Understood: {{ this.easyCards.length }}</p>
          <p>Repeat: {{ this.hardCards.length }}</p>
          <div v-if="!currentCard">
            <p>All cards completed for this practice round</p>
          </div>
        </b-container>
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
      practiceCards: [],
      hardCards: [],
      easyCards: [],
      showExplanation: false,
      currentCard: null
    }
  },
  mounted() {
    this.getPracticeCards()
  },
  methods: {
    nextCard() {
      if (this.practiceCards.length > 0) {
        this.currentCard = this.practiceCards.shift()
        this.showExplanation = false
      } else if (this.hardCards.length > 0) {
        this.practiceCards = this.hardCards
        this.hardCards = []
        this.nextCard()
      } else {
        this.currentCard = null
      }
    },
    async getPracticeCards() {
      const userId = localStorage.getItem('userId')
      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.practiceCards = response.data.deck.cards

        console.log(response.data.deck.cards)
        this.nextCard()
      } catch (error) {
        console.error('Error fetching cards from deck: ', error)
      }
    },
    handleCard(difficulty) {
      if (difficulty === 'hard') {
        this.hardCards.push(this.currentCard)
        console.log('Current card has been labeled as hard: ', this.currentCard)
      } else if (difficulty === 'easy') {
        this.easyCards.push(this.currentCard)
        console.log('Current card has been labeled as easy: ', this.currentCard)
      }
      this.nextCard()
    }
  }
}

</script>

<style scoped>

.practiceContainer{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.practicePage {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: #DEDBCC;
}

.practiceCard {
  background-color: #6A6A6A;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-style: solid;
  border-radius: 1em;
  width: fit-content;
  max-width: 400px;
  margin: 20px;
  height: 15em;
}
.practiceCard p {
  color: white;
  font-size: medium;
}

.cardText {
  margin-bottom: 4em;
 
}

.practiceButtons {
  width: 8em;
}

.practiceButtons p{
  font-size: small;
}

.difficultyButtonsBox {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
