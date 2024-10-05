<template>
    <div>
        <h1>Practice Mode</h1>
    </div>

</template>

<script>
import { Api } from '@/Api.js'

export default {
  props: {
    deckId: {
      type: String,
      required: true
    },
    data() {
      return {
        practiceCards: [],
        hardCards: [],
        showExplanation: false,
        currentCard: null
      }
    },
    mounted() {
      this.getPracticeCards()
    },
    methods: {
      async getPracticeCards() {
        const userId = localStorage.getItem('userId')
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}/cards`)
        this.practiceCards = response.data.cards
        console.log(response.data.cards)
      }
    }
  }
}
</script>
