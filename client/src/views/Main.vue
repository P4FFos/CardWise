<template>
  <div>
    <div class="mainPage">
      <div class="hamburgerMenu" v-if="isSmallScreen" @click="toggleNavBar">
        <img src="../assets/icons/hamburgerIcon.svg" alt="">
      </div>
      <div :class="['sideNavBar', { 'sideNavBar-visible': isNavVisible, 'sideNavBar-hidden': isSmallScreen && !isNavVisible }]" v-if="isNavVisible || !isSmallScreen">
        <div class="cardWise">
          <img  class="mainLogo" src="../assets/logos/mainLogo.svg" alt="">
          <p>CardWise</p>
        </div>
        <div class="userProfileRoute">
          <img id="userProfileIcon" src="../assets/icons/userProfileIcon.svg" alt="">
          <button @click="openUserProfile"><p><b>User Profile</b></p></button>
        </div>
        <div class="achievementsRoute">
          <img id="achievementsIcon" src="../assets/icons/achievementIcon.svg" alt="">
          <button @click="openAchievements"><p><b>Achievements</b></p></button>
        </div>
        <div class="logoutButton">
          <button @click="logout"><p><b>Logout</b></p></button>
        </div>
      </div>
      <div class="contentContainer" :class="{ 'hiddenContent': isSmallScreen && isNavVisible }">
        <div class="deckOperationsContainer">
          <div class="createDeckContainer">
            <label for="deckName">New deck name:</label>
            <input type="text" id="deckName" v-model="newDeckName" placeholder="Enter deck name">
            <button @click="addNewDeck">Add new deck</button>
          </div>
          <div class="filterDecks">
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
          <div id="deleteAllDecksButton">
            <button @click="deleteAllDecks">Delete all decks</button>
          </div>
        </div>
          <div v-if="deckInfo" class="allDecks">
            <li class="deck" v-for="deck in deckInfo" :key="deck._id" @contextmenu.prevent="showContextMenu($event, deck._id)">
              <router-link :to="{ name: 'deck', params: { deckId: deck._id } }">
                <p id="deckTitle">{{ deck.name }}</p>
                <p v-if="deck.cards.length > 0">Cards: {{ deck.cards.length }}</p>
                <p v-else>No cards in the deck</p>
              </router-link>
              <div v-if="editDeckId !== deck._id" class="changeCard">
              <button @click="toggleEditDeck(deck)">Edit Deck</button>
              <button @click="deleteDeck(deck)">Delete Deck</button>
              </div>
              <div class="submitEditDeck" v-if="deckId === deck._id">
                <input type="text" v-model="editDeckName" placeholder="Enter new name...">
                <button @click="saveNewDeckName(deck)">Submit</button>
              </div>
            </li>
          </div>
          <context-menu v-if="showMenu"
          :deckId="selectedDeckId"
          :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' , position: 'absolute' }">
        </context-menu>
      </div>
    </div>
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
      editDeckName: '',
      editDeckId: null,
      newDeckName: '',
      deckInfo: [],
      sortField: 'name',
      sortOrder: 'asc',
      selectedDeckId: null,
      showMenu: false,
      isSmallScreen: false,
      isNavVisible: false,
      links: [],
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
        alert('Failed to get all decks')
      }
    },
    // create new deck and save in to the database for current user
    async addNewDeck() {
      const userId = localStorage.getItem('userId')

      try {
        const newDeck = { name: this.newDeckName, cards: [] }
        const response = await Api.post(`/v1/users/${userId}/decks`, newDeck)
        this.deckInfo.push(response.data.deck)
        // complete achievement t1
        const userData = await Api.get(`/v1/users/${userId}`)
        const user = userData.data.user
        if (user.deckAmount >= 10) {
          await Api.put(`/v1/users/${userId}/achievements/t1`, {
            completed: true
          })
        }
      } catch (error) {
        alert('Failed to add new deck')
      }
    },
    // delete all decks from the database of current user
    async deleteAllDecks() {
      const userId = localStorage.getItem('userId')

      try {
        await Api.delete(`/v1/users/${userId}/decks`)
        this.deckInfo = []
        // complete achievement t4
        await Api.put(`/v1/users/${userId}/achievements/t4`, {
          completed: true
        })
      } catch (error) {
        alert('Failed to delete all decks')
      }
    },
    async getSpecDeck() {
      const userId = localStorage.getItem('userId')
      try {
        const response = await Api.get(`/v1/users/${userId}/decks/${this.deckId}`)
        this.links = response.data._links
      } catch (error) {
        console.error('Failed to get specific deck:', error)
      }
    },
    toggleEditDeck(deck) {
      this.deckId = deck._id
      this.editDeckId = deck._id
    },
    toggleNavBar() {
      if (this.isSmallScreen) {
        this.isNavVisible = !this.isNavVisible
      }
    },
    handleResize() {
      this.isSmallScreen = window.innerWidth <= 768
      if (!this.isSmallScreen) {
        this.isNavVisible = true
      } else {
        this.isNavVisible = false
      }
    },
    async saveNewDeckName() {
      await this.getSpecDeck()
      try {
        this.editDeckCalled = false
        const editUrl = this.links['update deck name'].href
        await Api.patch(editUrl, {
          name: this.editDeckName
        })
        this.editDeckName = ''
        this.deckId = null
        this.editDeckId = null
        this.getAllDecks()
      } catch (error) {
        console.error('Failed to edit the deck: ', error)
      }
    },
    async deleteDeck(deck) {
      try {
        const userId = localStorage.getItem('userId')
        await Api.delete(`/v1/users/${userId}/decks/${deck._id}`)
        this.getAllDecks()
      } catch (error) {
        console.error('Failed to delete deck: ', error)
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
        alert('Failed to sort decks')
      }
    },
    showContextMenu(event, deckId) {
      this.selectedDeckId = deckId
      this.menuPosition.x = event.clientX
      this.menuPosition.y = event.clientY
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
  },
  mounted() {
    this.getAllDecks()
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>

  .mainPage {
    position: fixed;
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;

  }

  .hamburgerMenu {
    display: none;
  }

  .cardWise {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 3em;
  }

  .cardWise p {
    font-size: xx-large;
  }

  .mainLogo {
    margin: 0% 1% 1% 2.3%;
    width: 50%;
  }

  .contentContainer {
    display: flex;
    flex-direction: column;
    width: 80vw;
    height: 100vh;
  }

  .deckOperationsContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
  }

  .submitEditDeck {
    display: flex;
    flex-direction: column;
    align-items: center;
  }


  .createDeckContainer{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .deckOperationsContainer, .allDecks {
    width: 80vw;
  }

  .sideNavBar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20%;
    height: 100vh;
    border-right: 3px solid #6A6A6A;
    gap: 10px;
  }

  .sideNavBar button {
    background: none;
    align-self: center;
  }
  .sideNavBar button p {
    color: #6A6A6A;
    font-size: x-large;
  }

  .userProfileRoute {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 15px;
    margin-left: 20px;
  }

  .achievementsRoute {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .logoutButton {
    align-self: center;
  }

  #userProfileIcon {
    width: 20%;
  }

  #achievementsIcon {
    width: 30%;
  }

  #deleteAllDecksButton {
    align-self: flex-end;
    margin: 20px;

  }

    .allDecks {
    display: grid;
    align-self: center;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    justify-items: center;
    align-items: center;
    overflow-y: auto;
    flex-grow: 1;
    width: 60vw;
    max-height: 460px;
    border-style: solid;
    border-width: 2px;
    border-radius: 10px;
    margin: 25px;
    padding: 10px;
  }

  .deck {
    background-color: #6A6A6A;
    list-style: none;
    min-width: 250px;
    max-width: 200px;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    border-radius: 5%;
  }

  .deck p {
    color: white;
  }

  #deckTitle {
    font-size: xx-large;
  }
  @media (max-width: 768px) {

    .hiddenContent {
      display: none;
    }

    .contentContainer {
      align-items: center;
      width: 100vw;
    }

    .createDeckContainer {
      flex-direction: column;
    }

    .hamburgerMenu {
      display: block;
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 1000;
    }

    .hamburgerMenu img {
      width: 10%;
    }

    .sideNavBar {
      position: fixed;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      z-index: 999;
    }

  .userProfileRoute {
    margin-left: 50px;
  }

  .achievementsRoute {
    margin-left: 25px;
  }

    .deckOperationsContainer {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .filterDecks {
      font-size: smaller;
    }

    .allDecks {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    #deleteAllDecksButton {
      align-self: center;
      margin: 20px;
    }
  }

</style>
