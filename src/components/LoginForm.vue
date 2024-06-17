<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';
import PhonebookIcon from '@/components/icons/PhonebookIcon.vue';

const authStore = useAuthStore();
const { loading } = authStore;

const validationSchema = yup.object({
  email: yup.string().email('Must be a valid e-mail.').required('E-mail is required.'),
  password: yup.string().min(6, 'Password needs to be at least 6 characters.').required('Password is required.')
});

const { handleSubmit } = useForm({
  validationSchema,
});

const email = useField('email');
const password = useField('password');

const handleLogin = async (values: { email: string, password: string }) => {
  try {
    await authStore.login(values.email, values.password);
  } catch (error) {
    console.error('Failed to login:', error);
  }
};

const submit = handleSubmit(handleLogin);
</script>

<template>
  <v-sheet :elevation="13" class="px-5 bg-blue-grey-darken-3 py-11 rounded-lg">
    <form @submit.prevent="submit" class="mx-auto">
      <PhonebookIcon class="mb-7"/>
      <v-text-field
          variant="outlined"
          class="mb-3"
          base-color="blue-grey-lighten-3"
          color="blue-grey-lighten-4"
          placeholder="mail@example.com"
          v-model="email.value.value"
          :error-messages="email.errorMessage"
          label="E-mail"
      ></v-text-field>
      <v-text-field
          variant="outlined"
          class="mb-3"
          color="blue-grey-lighten-4"
          placeholder="qwe123"
          v-model="password.value.value"
          :error-messages="password.errorMessage"
          label="Password"
          type="password"
      ></v-text-field>
      <v-btn
          :loading="authStore.loading"
          variant="outlined"
          type="submit"
      >
        Log in
      </v-btn>
      <h1 v-if="loading">Loading...</h1>
    </form>
  </v-sheet>
</template>

<style scoped>
form {
  text-align: center;
  width: 25em;
}
</style>
