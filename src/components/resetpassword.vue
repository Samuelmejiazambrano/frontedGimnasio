<template>
  <div class="q-pa-md" id="reset-password">
    <div
      class="q-gutter-y-md column"
      id="cont"
      style="
        width: 400px;
        padding: 30px;
        border-radius: 10px;
        background-color: rgba(243, 243, 243, 0.8); /* Color de fondo con opacidad */
        box-shadow: 2px 10px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <h3 style="margin-bottom: 20px; text-align: center">Restablecer Contraseña</h3>
      <q-input
        class="input"
        v-model="newPassword"
        type="password"
        label="Nueva Contraseña"
        placeholder="Introduce tu nueva contraseña"
        dense
        outlined
      />
      <q-input
        class="input"
        v-model="confirmPassword"
        type="password"
        label="Confirmar Contraseña"
        placeholder="Confirma tu nueva contraseña"
        dense
        outlined
      />
      <q-btn
        style="width: 80%"
        @click="resetPassword"
        color="primary"
        label="Restablecer"
        dense
      />
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify, useQuasar } from 'quasar';
import { useResetStore } from '../stores/reset.js';

const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const useReset = useResetStore();

const resetPassword = async () => {
  if (newPassword.value === '' || confirmPassword.value === '') {
    Notify.create('Por favor ingresa y confirma tu nueva contraseña');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    Notify.create('Las contraseñas no coinciden');
    return;
  }

  try {
    const token = route.query.reset;
    const response = await useReset.nuevaContrasena(newPassword.value, token);
    $q.notify({
      message: response.data.msg,
      color: 'green',
      icon: 'check',
      position: 'top',
      timeout: 3000
    });
    newPassword.value = '';
    confirmPassword.value = '';
    if (response.data.msg === 'Contraseña actualizada con éxito') {
      setTimeout(() => {
        router.push('/'); // Cambia '/' por la ruta de tu página de inicio de sesión
      }, 3000); // 3 segundos de retraso
    }
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    $q.notify({
      message: error.response.data.msg || 'Error al restablecer la contraseña.',
      color: 'negative',
      icon: 'warning',
      position: 'top',
      timeout: 3000
    });
  }
};
</script>

<style scoped>
#reset-password {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://www.elindependiente.com/wp-content/uploads/2023/07/en-cuanto-tiempo-se-nota-el-gimnasio-1.png");
  background-size: cover;
  background-repeat: no-repeat;
}
#reset-password h3 {
  font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  font-weight: 900;
}
.input {
  width: 100%;
  margin-bottom: 25px;
}
#cont {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 500px;
}
.message {
  margin-top: 20px;
  text-align: center;
  color: #d9534f;
  font-weight: bold;
}
</style>
