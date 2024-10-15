<template>
  <div class="practiceContainer">
    <div class="backButtonContainer">
      <router-link :to="{ name: 'deck', params: { deckId: this.deckId } }">
          <button class="fontForPracticeText" id="backToDeck">
            Go back
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
            <p class="passTestAlert">All cards completed for this practice round</p>
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
      practiced: 0,
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
        this.updatePracticeCounter()
      }
    },
    async getPracticeCards() {
      const userId = localStorage.getItem('userId')
      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.practiceCards = response.data.deck.cards
        this.nextCard()
      } catch (error) {
        alert('Error fetching cards from deck')
      }
    },
    handleCard(difficulty) {
      if (difficulty === 'hard') {
        this.hardCards.push(this.currentCard)
      } else if (difficulty === 'easy') {
        this.easyCards.push(this.currentCard)
      }
      this.nextCard()
    },
    async updatePracticeCounter() {
      const userId = localStorage.getItem('userId')
      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}`)
        const deck = response.data.deck
        this.practised = deck.practiced || 0

        this.practiced = deck.practiced + 1

        await Api.patch(`/v1/users/${userId}/decks/${this.deckId}`, {
          practiced: this.practiced
        })

        // complete achievement t3
        if (this.practiced >= 5) {
          await Api.put(`/v1/users/${userId}/achievements/t3`, {
            completed: true
          })
        }
      } catch (error) {
        alert('Error updating practice counter')
      }
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
  font-family: 'InstrumentSerif', serif;
  color: #6A6A6A;
  margin-bottom: 20px;
}

.practiceContainer {
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
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

#backToDeck {
  width: 120px;
  height: 40px;
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
  width: 6em;
}

.practiceButtons p {
  font-size: medium;
}

.passTestAlert{
  color: #EA9944;
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
    width: 100px;
    height: 35px;
  }

  .cardsDifficultyText {
    font-size: small;
  }

  .practiceButtons {
    width: fit-content;
  }
}

</style>
