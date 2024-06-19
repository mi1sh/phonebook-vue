<script setup lang="ts">
import PhonebookIcon from '@/components/icons/PhonebookIcon.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  try {
    authStore.logout();
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};
</script>

<template>
  <section class="bg-blue-grey-darken-4">
    <v-container>
      <h1>
        <PhonebookIcon/>
        PhoneBook
      </h1>
      <v-btn variant="outlined" @click="handleLogout">
        Выход
        <template v-slot:append>
          <v-icon icon="mdi-exit-run"></v-icon>
        </template>
      </v-btn>
    </v-container>
  </section>
</template>

<style scoped>
  section {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 5em;
    position: fixed;
    background-color: #1c1c1c;
  }

  .v-container {
    justify-content: space-between;
    align-items: center;
    width: 80%;
    height: 100%;
    display: flex;
  }

  h1 {
    align-items: center;
    display: flex;
    gap: 0.5em;
  }
</style>