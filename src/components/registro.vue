<template>
  <div class="q-pa-md" id="register">
    <div class="form-container">
      <h3 class="titulo">Registrar</h3>
      <div class="form-inputs">
        <q-input
          outlined
          v-model="nombre"
          label="Nombre"
          class="q-my-sm"
          type="text"
        />
        <q-input
          outlined
          v-model="sede"
          label="Sede"
          class="q-my-sm"
          type="text"
        />
        <q-input
          outlined
          v-model="email"
          label="Email"
          class="q-my-sm"
          type="email"
        />
        <q-input
          outlined
          v-model="direccion"
          label="Dirección"
          class="q-my-sm"
          type="text"
        />
        <q-input
          outlined
          v-model="telefono"
          label="Teléfono"
          class="q-my-sm"
          type="tel"
        />
        <q-select
          outlined
          v-model="rol"
          label="Rol"
          class="q-my-sm"
          :options="roles"
          option-label="label"
          option-value="value"
        />
        <q-input
          outlined
          v-model="password"
          label="Password"
          class="q-my-sm"
          type="password"
        />
      </div>
      <div class="q-mt-md">
        <q-btn
          @click="agregarUsuario()"
          color="primary"
          label="Agregar"
          class="full-width-btn"
        />
      </div>
      <p class="login-link">¿Ya tienes cuenta? <a href="#">Inicia sesión</a></p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useUsuarioStore } from "../stores/usuario.js";

let nombre = ref("");
let sede = ref("");
let email = ref("");
let direccion = ref("");
let telefono = ref("");
let rol = ref("");
let roles = ref([
  { label: "Admin", value: "admin" },
  { label: "Instructor", value: "instructor" },
  { label: "Recepcionista", value: "recepcionista" },
]);
let token = ref("");
let password = ref("");
let accion = ref(1);
let currentId = ref(null);
let useUsuario = useUsuarioStore();

const router = useRouter();





const agregarUsuario = async () => {
  if (nombre.value == "") {
    Notify.create("por favor ingrese su nombre ");
  } else if (sede.value == "") {
    Notify.create("por favor ingrese la Sede");
  } else if (email.value == "") {
    Notify.create("por favor ingrese el Email");
  } else if (direccion.value == "") {
    Notify.create("por favor ingrese la direccion");
  } else if (telefono.value == "") {
    Notify.create("por favor ingrese el telefono");
  } else if (rol.value == "") {
    Notify.create("por favor ingrese el rol ");
  } else if (password.value == "") {
    Notify.create("por favor ingrese la Contrasena correcta ");
  } else {
    try {
      await useUsuario.agregarUsuarios({
        nombre: nombre.value,
        sede: sede.value,
        email: email.value,
        direccion: direccion.value,
        telefono: telefono.value,
        rol: rol.value.value,
        password: password.value,
      });
router.push('/');
    } catch (error) {
      console.error("Error al agregar inventario:", error);
    }
  }
};







</script>

<style scoped>
#register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.form-container {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo {
  font-size: 1.8rem;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  margin-bottom: 20px;
}

.form-inputs {
  width: 100%;
}

.q-my-sm {
  margin-top: 10px;
  margin-bottom: 10px;
}

.q-mt-md {
  margin-top: 20px;
}

.full-width-btn {
  width: 100%;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
