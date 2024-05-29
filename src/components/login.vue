<template>
  <div class="q-pa-md" id="login">
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
        @click="loginUser()"
        color="primary"
        label="Iniciar sesión"
        dense
      />
      <p>
        ¿No tienes una cuenta?
        <router-link class="link" to="/registro"> Regístrate
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioStore } from "../stores/usuario.js";

let email = ref("");
let password = ref("");

const router = useRouter();
const useUsuario = useUsuarioStore();

const loginUser = async () => {
  console.log(email.value, password.value);
  try {
    const data = await useUsuario.login(email.value, password.value);
    if (data.token) {
      console.log(data);
      useUsuario.token = data.token;
      router.push('/home');
    } else {
      console.error('Token no encontrado en la respuesta:', data);
    }
  } catch (error) {
    console.error('Error en la solicitud de inicio de sesión:', error);
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
