<template>
  <div class="contextMenu">
      <ul>
      <li @click="toggleEditDeck">
        Edit Deck
        <div v-if="editDeckCalled" class="editInput">
          <label for="">New Deck Name:</label>
          <input type="text" v-model="editDeckName" placeholder="Enter new name for deck">
          <button @click="saveNewDeckName">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </div>
      </li>
      <li @click="deleteDeck">Delete deck</li>
      </ul>
  </div>
</template>

<style>
    .contextMenu {
      height: min-content;
      width: min-content;
      background-color: red;
    }
  .contextMenu ul {
    list-style-type: none;
    background-color: gray;
    border-style: double;
    width: min-content;
    border-color: red;
    padding: 5px;
    margin: 0;
  }
  .contextMenu li {
    list-style-type: none;
    background-color: gray;
    border-style: dashed;
    width: max-content;
    padding: 5px;
    margin: 0;
  }
  .contextMenu li:hover {
    background-color: white;
  }
  .editInput {
    background-color: black;
    padding: 10px;
    margin-top: 10px;
  }

</style>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      editDeckName: '',
      editDeckCalled: false
    }
  },
  props: {
    deckId: {
      type: String,
      required: true
    }
  },
  methods: {
    toggleEditDeck() {
      this.editDeckCalled = true
    },
    cancelEdit() {
      this.editDeckCalled = false
      this.editDeckName = ''
    },
    async saveNewDeckName() {
      try {
        this.editDeckCalled = false
        const userId = localStorage.getItem('userId')
        await Api.patch(`/v1/users/${userId}/decks/${this.deckId}`, {
          name: this.editDeckName
        })
        console.log('Edit deck with Id: ', this.deckId)
        this.editDeckName = ''
      } catch (error) {
        console.log('Failed to edit the deck: ', error)
      }
    },
    async deleteDeck() {
      try {
        const userId = localStorage.getItem('userId')
        await Api.delete(`/v1/users/${userId}/decks/${this.deckId}`)
        console.log('Deleted deck with Id: ', this.deckId)
      } catch (error) {
        console.log('Failed to delete deck: ', error)
      }
    }
  }
}
</script>
