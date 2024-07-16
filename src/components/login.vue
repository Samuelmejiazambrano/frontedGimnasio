<template>
  <div class="q-pa-md" id="login" :loading="loading">
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
      <h3 style="margin-bottom: 20px; text-align: center">Iniciar sesión</h3>
      <q-input
        class="input"
        v-model="email"
        label="Usuario"
        placeholder="Introduce tu nombre de usuario"
        dense
        outlined
      />
      <q-input
        class="input"
        v-model="password"
        label="Contraseña"
        type="password"
        placeholder="Introduce tu contraseña"
        dense
        outlined
      />
      <q-btn
        style="width: 80%"
        @click="loginUser"
        color="primary"
        dense
      >
        <template v-if="loading">
          <q-spinner size="20px" color="white" />
        </template>
        <template v-else>
          Iniciar sesión
        </template>
      </q-btn>
      <p>
        ¿No tienes una cuenta?
        <router-link class="link" to="/registro"> Regístrate
        </router-link>
      </p>
      <p>
        ¿Se te olvidó la contraseña?
        <router-link class="link" to="/reset"> Restablecer
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioStore } from "../stores/usuario.js";
import { Notify } from "quasar";
import { QSpinner } from 'quasar';

let loading = ref(false);
let email = ref("");
let password = ref("");

const router = useRouter();
const useUsuario = useUsuarioStore();

const loginUser = async () => {
  loading.value = true;

  if (email.value === "") {
    Notify.create("Por favor, ingrese el email correcto");
    loading.value = false;
  } else if (password.value === "") {
    Notify.create("Por favor, ingrese la contraseña correcta");
    loading.value = false;
  } else {
    console.log(email.value, password.value);
    try {
      const data = await useUsuario.login(email.value, password.value);
      if (data.token) {
        console.log(data);
        useUsuario.token = data.token;
        router.push('/home');
      } else {
        Notify.create({
          message: 'Token no encontrado en la respuesta.',
          color: 'negative'
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
      // Verificar si el error contiene una respuesta con mensaje
      if (error.response && error.response.data && error.response.data.mensaje) {
        Notify.create({
          message: error.response.data.mensaje,
          color: 'negative'
        });
      } else {
        Notify.create({
          message: 'Error en la solicitud de inicio de sesión.',
          color: 'negative'
        });
      }
    } finally {
      loading.value = false;
    }
  }
};
</script>

<style scoped>
#login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://www.elindependiente.com/wp-content/uploads/2023/07/en-cuanto-tiempo-se-nota-el-gimnasio-1.png");
  background-size: cover;
  background-repeat: no-repeat;
}
#login h3 {
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
