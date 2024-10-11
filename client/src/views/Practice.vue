<template>
  <div class="practiceContainer">
    <div class="backButtonContainer">
      <router-link :to="{ name: 'deck', params: { deckId: this.deckId } }">
          <button class="fontForPracticeText" id="backToDeck">
            Go Back
          </button>
        </router-link>
    </div>
        <b-container class="practicePage">
        <h1>Practice</h1>
        <div v-if="currentCard">
            <b-row cols="12" md="12" lg="12" class="practiceCard" >
              <b-col>
                <p class="fontForPracticeText" v-if="!showExplanation"> {{ currentCard.content }}</p>
                <p class="fontForPracticeText" :class="getTextClass" v-else>{{ currentCard.explanation }}</p>
                <button  class="practiceButtons" v-if="!showExplanation" @click="showExplanation = true">
                  <p class="fontForPracticeText">
                    Explanation
                  </p>
                </button>
                <div class="difficultyButtonsBox" v-else>
                  <button class="practiceButtons" @click="handleCard('easy')"><p>Easy</p></button>
                  <button class="practiceButtons" @click="handleCard('hard')"><p>Hard</p></button>
                </div>
              </b-col>
            </b-row>
          </div>
          <p class="cardsDifficultyText">Cards Left: {{ this.practiceCards.length + 1 }}</p>
          <p class="cardsDifficultyText">Understood: {{ this.easyCards.length }}</p>
          <p class="cardsDifficultyText">Repeat: {{ this.hardCards.length }}</p>
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
  },
  computed: {
    getTextClass() {
      if (this.currentCard && this.showExplanation && this.currentCard.explanation.length > 50) {
        return 'longText'
      }
      return 'normalText'
    }
  }
}

</script>

<style scoped>

h1 {
  font-family: 'InstrumentSerif';
  color: #6A6A6A;
  margin-bottom: 20px;
}

.practiceContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
}

.backButtonContainer {
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 1em;
  left: 1em;
}

.practicePage {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-style: none;
  background-color: #DEDBCC;
}

.practiceCard {
  background-color: #6A6A6A;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 1em;
  width: 12em;
  height: 20em;
}

.practiceCard p,
.fontForPracticeText {
  font-size: large;
  color: white;
}

.cardsDifficultyText {
  font-weight: bold;
  color: #6A6A6A;
  font-size: large;
}

.practiceButtons {
  background-color: #EA9944;
  width: 6em;
}

.practiceButtons p {
  font-size: large;
}

/* Responsive Styling */
@media (max-width: 768px) {
  .backButtonContainer {
    justify-content: center;
    position: relative;
    top: 0;
    left: 0;
  }

  #backToDeck {
    width: 10em;
  }

  .cardsDifficultyText {
    font-size: small;
  }

  .practiceButtons {
    width: fit-content;
  }

  .practiceButtons p{
    font-size: medium;
  }
}

</style>
