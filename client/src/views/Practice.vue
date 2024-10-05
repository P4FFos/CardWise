<template>
    <div>
        <h1>Practice Mode</h1>
        <div v-if="currentCard">
            <p v-if="!showExplanation"> {{ currentCard.content }}</p>
            <p v-else>{{ currentCard.explanation }}</p>
            <button v-if="!showExplanation" @click="showExplanation = true">Explanation</button>
            <div v-else>
                <button @click="handleCard('easy')">Easy</button>
                <button @click="handleCard('hard')">Hard</button>
            </div>
            <p>Not Practiced: {{ this.practiceCards.length + 1 }}</p>
            <p>Understood: {{ this.easyCards.length }}</p>
            <p>Hard: {{ this.hardCards.length }}</p>
        </div>
        <div v-else>
            <p>All cards completed for this practice round</p>
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
