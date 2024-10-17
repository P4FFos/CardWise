<template>
  <div>
    <div class="mainPage">
      <div class="hamburgerMenu" v-if="isSmallScreen" @click="toggleNavBar">
        <img src="../assets/icons/hamburgerIcon.svg" alt="">
      </div>
      <div
        :class="['sideNavBar', { 'sideNavBar-visible': isNavVisible, 'sideNavBar-hidden': isSmallScreen && !isNavVisible }]"
        v-if="isNavVisible || !isSmallScreen">
        <div class="cardWise">
          <img class="mainLogo" src="../assets/logos/mainLogo.svg" alt="">
          <p class="sideBarText">CardWise</p>
        </div>
        <div class="userProfileRoute">
          <img id="userProfileIcon" src="../assets/icons/userProfileIcon.svg" alt="">
          <button @click="openUserProfile"><p class="sideBarText">User Profile</p></button>
        </div>
        <div class="achievementsRoute">
          <img id="achievementsIcon" src="../assets/icons/achievementIcon.svg" alt="">
          <button @click="openAchievements"><p class="sideBarText">Achievements</p></button>
        </div>
        <div class="logoutButton">
          <button @click="logout"><p class="logoutButton">Logout</p></button>
        </div>
      </div>
      <div class="contentContainer" :class="{ 'hiddenContent': isSmallScreen && isNavVisible }">
        <div class="deckOperationsContainer">
          <div class="createDeckContainer">
            <label for="deckName">New deck name:</label>
            <input type="text" id="deckName" v-model="newDeckName" placeholder="Enter deck name">
            <button class="addNewDeckButton" @click="addNewDeck">Add new deck</button>
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
            <button class="deleteAllDecksButton" @click="deleteAllDecks">Delete all decks</button>
          </div>
        </div>
        <div v-if="deckInfo" class="allDecks">
          <li class="deck" v-for="deck in deckInfo" :key="deck._id">
            <router-link style="text-decoration: none" :to="{ name: 'deck', params: { deckId: deck._id } }">
              <p id="deckTitle">{{ deck.name }}</p>
              <p v-if="deck.cards.length > 0">Cards: {{ deck.cards.length }}</p>
              <p v-else>No cards in the deck</p>
            </router-link>
            <div v-if="editDeckId !== deck._id" class="changeCard">
              <button class="editAndDeleteButtons" @click="toggleEditDeck(deck)">Edit Deck</button>
              <button class="editAndDeleteButtons" @click="deleteDeck(deck)">Delete Deck</button>
            </div>
            <div class="submitEditDeck" v-if="deckId === deck._id">
              <input class="newDeckNameField" type="text" v-model="editDeckName" placeholder="Enter new name...">
              <button @click="saveNewDeckName(deck)">Submit</button>
            </div>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api.js'

export default {
  components: {},
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
      isSmallScreen: false,
      isNavVisible: false,
      links: []
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
        alert('Failed to get specific deck')
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
        alert('Failed to edit the deck')
      }
    },
    async deleteDeck(deck) {
      try {
        const userId = localStorage.getItem('userId')
        await Api.delete(`/v1/users/${userId}/decks/${deck._id}`)
        this.getAllDecks()
      } catch (error) {
        alert('Failed to delete deck')
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

.editAndDeleteButtons {
  width: 100px;
  height: 30px;
}

.addNewDeckButton, .deleteAllDecksButton {
  width: 150px;
  height: 35px;
}

select {
  background: #DEDBCC;
  border-radius: 5px;
  border: 2px solid #6A6A6A;
  height: 30px;
  width: 120px;
  color: #6A6A6A;
}

.changeCard {
  margin-bottom: 10px;
}

.newDeckNameField {
  width: 60%;
  margin-left: 7%;
}

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

.cardWise, .userProfileRoute {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  width: 90%;
  margin-bottom: 30px;
  gap: 15px;
}

.achievementsRoute{
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  width: 95%;
  margin-bottom: 30px;
  gap: 5px;
}

.sideBarText {
  font-size: x-large;
  margin-bottom: 0;
  font-weight: 600;
}

.mainLogo {
  width: 20%;
  margin: 0 2% 0 0;
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
  align-items: center;
  margin-top: 40px;
  align-self: center;
  gap: 10px;
}

.submitEditDeck {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.createDeckContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
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

.logoutButton {
  align-self: center;
  text-align: center;
  width: 100%;
  font-weight: 600;
}

#userProfileIcon {
  width: 20%;
}

#achievementsIcon {
  width: 25%;
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
  width: 90%;
  max-height: 700px;
  border-style: none;
  margin: 25px;
  padding: 10px;
}

.deck {
  background-color: #6A6A6A;
  list-style: none;
  min-width: 300px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  border-radius: 20px;
}

.filterDecks {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.deck p {
  color: white;
}

label {
  font-size: large;
}

#deckTitle {
  font-size: xx-large;
}
@media (min-width: 1920px){
  .allDecks{
    grid-template-columns: repeat(4, 1fr);
    max-height: 800px;
  }
}
@media (max-width: 768px) {

  label {
    font-size: large;
  }

  .hiddenContent {
    display: none;
  }

  .contentContainer {
    align-items: center;
    width: 100%;
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

  .deckOperationsContainer {
    margin-top: 70px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .filterDecks {
    font-size: smaller;
  }

  .allDecks {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  #deleteAllDecksButton {
    align-self: center;
  }
}

</style>
