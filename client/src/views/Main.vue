<template>
  <div>
    <h1>Main Page</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Api } from '@/Api'
import { useRouter } from 'vue-router'

const router = useRouter()

const getAllDecks = async () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    return router.push('/login')
  }
  try {
    const { data } = await Api.get(`/v1/users/${userId}/decks`)
    console.log('Get all decks:', data.decks)
  } catch (error) {
    console.error('Failed to get all decks:', error)
  }
}

onMounted(getAllDecks)
</script>

<style>

</style>
