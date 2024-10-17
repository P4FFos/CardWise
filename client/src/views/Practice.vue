<template>
  <div class="practiceContainer">
    <img class="goBackIcon" @click="goToDeck" src="../assets/icons/backButton.svg" alt="Logo"/>
    <div class="backButtonContainer">
      <p class="goToDeck" @click="goToDeck"> Go back</p>
    </div>
        <b-container class="practicePage">
        <h1>Practice</h1>
        <div v-if="currentCard">
            <b-row cols="12" md="12" lg="12" class="practiceCard" >
              <b-col>
                <p class="fontForPracticeText" v-if="!showExplanation"> {{ currentCard.content }}</p>
                <p class="fontForPracticeText" :class="getTextClass" v-else>{{ currentCard.explanation }}</p>
                <button  class="practiceButtons" v-if="!showExplanation" @click="showExplanation = true">
                    Explanation
                </button>
                <div class="difficultyButtonsBox" v-else>
                  <button class="practiceButtons" @click="handleCard('easy')">Easy</button>
                  <button class="practiceButtons" @click="handleCard('hard')">Hard</button>
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
    },
    goToDeck() {
      this.$router.push({ name: 'deck' })
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

.goBackIcon{
  display: none;
}

h1 {
  font-family: 'InstrumentSerif', serif;
  color: #6A6A6A;
  margin-bottom: 20px;
}

.goToDeck{
  font-size: 30px;
  font-weight: 600;
  color: #363529;
  margin: 1% 0 0 2%;
  text-align: left;
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
  width: 100%;
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
  height: 30px;
}

.practiceButtons p {
  font-size: medium;
}

.passTestAlert{
  color: #EA9944;
}

/* Responsive Styling */
@media (max-width: 768px) {
  .goToDeck{
    display: none;
  }

  .goBackIcon{
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    width: 10%;
  }

  .backButtonContainer {
    justify-content: center;
    position: relative;
    top: 0;
    left: 0;
  }

  .cardsDifficultyText {
    font-size: small;
  }

  .practiceButtons {
    width: fit-content;
  }
}

</style>
