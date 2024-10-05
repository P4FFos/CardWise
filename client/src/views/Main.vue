<template>
  <div>
    <h1>Main Page</h1>
    <div>
      <button @click="logout">Logout</button>
    </div>
    <div>
      <button @click="getAllDecks">Show decks info</button>
      <button @click="deleteAllDecks">Delete all decks</button>
    </div>
    <div>
      <label for="deckName">New deck name:</label>
      <input type="text" id="deckName" v-model="newDeckName" placeholder="Enter deck name">
      <button @click="addNewDeck">Add new deck</button>
    </div>
    <div>
      <button @click="openAchievements">Achievements</button>
      <button @click="openUserProfile">User Profile</button>
    </div>
    <div>
      <label for="sortField">Sort by:</label>
      <select v-model="sortField" @change="sortDecks">
        <option value="name">Name</option>
        <option value="cardAmount">Number of Cards</option>
      </select>
      <label for="sortOrder">Order:</label>
      <select v-model="sortOrder" @change="sortDecks">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
    <div v-if="deckInfo" class="deck">
      <li v-for="deck in deckInfo" :key="deck._id" @contextmenu.prevent="showContextMenu($event, deck._id)">
        <router-link :to="{ name: 'deck', params: { deckId: deck._id } }">
          <p>Name: {{ deck.name }}</p>
          <p v-if="deck.cards.length > 0">Cards: {{ deck.cards.length }}</p>
          <p v-else>No cards in the deck</p>
          <p>Deck ID: {{ deck._id }}</p>
        </router-link>
      </li>
    </div>
    <context-menu v-if="showMenu"
      :deckId="selectedDeckId"
      :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' , position: 'absolute' }">
    </context-menu>
  </div>
</template>

<script>
import ContextMenu from '@/components/ContextMenu.vue'
import { Api } from '@/Api.js'

export default {
  components: {
    'context-menu': ContextMenu
  },
  data() {
    return {
      deckId: '',
      deckName: '',
      newDeckName: '',
      deckInfo: [],
      sortField: 'name',
      sortOrder: 'asc',
      selectedDeckId: null,
      showMenu: false,
      menuPosition: { x: 0, y: 0 }
    }
  },
  methods: {
    // get all decks from the database for current user
    async getAllDecks() {
      const userId = localStorage.getItem('userId')

      try {
        const response = await Api.get(`/v1/users/${userId}/decks`)
        this.deckInfo = response.data.decks
      } catch (error) {
        console.error('Failed to get all decks:', error)
      }
    },
    // create new deck and save in to the database for current user
    async addNewDeck() {
      const userId = localStorage.getItem('userId')

      try {
        const newDeck = { name: this.newDeckName, cards: [] }
        const response = await Api.post(`/v1/users/${userId}/decks`, newDeck)
        this.deckInfo.push(response.data.deck)
      } catch (error) {
        console.error('Failed to add new deck:', error)
      }
    },
    // delete all decks from the database of current user
    async deleteAllDecks() {
      const userId = localStorage.getItem('userId')

      try {
        await Api.delete(`/v1/users/${userId}/decks`)
        this.deckInfo = []
      } catch (error) {
        console.error('Failed to delete all decks:', error)
      }
    },
    // sort all decks based on the sort field and order
    async sortDecks() {
      const userId = localStorage.getItem('userId')

      try {
        const response = await Api.get(`/v1/users/${userId}/decks/sort`, {
          params: {
            field: this.sortField,
            order: this.sortOrder
          }
        })
        this.deckInfo = response.data
      } catch (error) {
        console.error('Failed to sort decks:', error)
      }
    },
    showContextMenu(event, deckId) {
      this.selectedDeckId = deckId
      this.menuPosition.x = event.clientX
      this.menuPosition.y = event.clientY

      console.log(`Context menu position: X: ${this.menuPosition.x}, Y: ${this.menuPosition.y}`)
      console.log('DeckId: ', deckId)

      this.showMenu = true
      document.addEventListener('click', this.handleClickOutside)
    },
    handleClickOutside() {
      const contextMenu = this.$el.querySelector('.contextMenu')
      if (contextMenu && !contextMenu.contains(event.target)) {
        this.hideContextMenu()
      }
    },
    hideContextMenu() {
      this.showMenu = false

      document.removeEventListener('click', this.handleClickOutside)
    },
    // open achievements page
    openAchievements() {
      this.$router.push('/achievements')
    },
    // open user profile page
    openUserProfile() {
      this.$router.push('/profile')
    },
    // logout and redirect to login page
    logout() {
      localStorage.removeItem('userId')
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>
