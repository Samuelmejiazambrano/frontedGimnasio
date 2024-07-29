<template>
  <div class="q-pa-md" id="recuperar">
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
      <h3 style="margin-bottom: 20px; text-align: center">Recuperar contraseña</h3>
      <q-input
  class="input"
  v-model="email"
  label="Correo electrónico"
  placeholder="Introduce tu correo electrónico"
  dense
  outlined
/>
<q-btn
  style="width: 80%"
  @click="recuperarContrasena"
  color="primary"
  label="Enviar solicitud"
  dense
/>

      <p>
        ¿Recuerdas tu contraseña?
        <router-link class="link" to="/"> Inicia sesión
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify, useQuasar } from 'quasar';
import { useResetStore } from "../stores/reset.js";

const email = ref("");
const router = useRouter();
const $q = useQuasar();
const useReset = useResetStore();

const recuperarContrasena = async () => {
  if (email.value === "") {
    Notify.create("Por favor ingresa tu correo electrónico");
  } else {
    try {
      const response = await useReset.envioCorreo(email.value);
      $q.notify({
        message: response.data.msg,
        color: 'green',
        icon: 'check',
        position: 'top',
        timeout: 3000
      });
      email.value = '';
    } catch (error) {
      console.error('Error en la solicitud de recuperación de contraseña:', error);
      $q.notify({
        message: error.response.data.msg || 'Error en la solicitud de recuperación de contraseña.',
        color: 'negative',
        icon: 'warning',
        position: 'top',
        timeout: 3000
      });
    }
  }
};

</script>

<style scoped>
#recuperar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://www.elindependiente.com/wp-content/uploads/2023/07/en-cuanto-tiempo-se-nota-el-gimnasio-1.png");
  background-size: cover;
  background-repeat: no-repeat;
}
#recuperar h3 {
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
</style>
