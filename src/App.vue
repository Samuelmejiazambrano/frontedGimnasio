<template>
  <q-layout view="hhh LpR fFf">
    <q-header
      v-if="!$route.meta.hideNavbar"
      reveal
      elevated
      class="bg-custom-primary text-white"
    >
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!$route.meta.hideNavbar"
      style="background-color: #344860"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <div class="drawer-menu">
        <q-avatar size="85px" color="white" style="margin-left: 35px">
          <img src="./components/img/69966.png" />
        </q-avatar>
        
        <!-- Mostrar el nombre del usuario -->
        <div class="user-name" style="margin-left: 35px; color: white; font-size: 30px; margin-top: 10px;">
          {{ userName }}
        </div>

        <q-btn
          dense
          flat
          round
          color="primary"
          text-color="white"
          @click="logout()"
          class="logout"
        >
          <q-icon name="exit_to_app" />
          <span class="logout-text">Cerrar sesión</span>
        </q-btn>

        <router-link class="link" to="/home">
          <q-icon name="home" /> Home
        </router-link>
        
        <template v-if="userRole === 'admin' || userRole === 'instructor'">
          <router-link class="link" to="/compras">
            <q-icon name="shopping_cart" /> Plan
          </router-link>
          <router-link class="link" to="/ventas">
            <q-icon name="monetization_on" /> Inventario
          </router-link>
          <router-link class="link" to="/productos">
            <q-icon name="store" /> Sedes
          </router-link>
          <router-link class="link" to="/venta">
            <q-icon name="people" /> Ventas
          </router-link>
        </template>

        <template v-if="userRole === 'admin' || userRole === 'recepcionista'">
          <router-link class="link" to="/cliente">
            <q-icon name="people" /> Clientes
          </router-link>
          <router-link class="link" to="/mantenimiento">
            <q-icon name="settings" /> Mantenimiento
          </router-link>
          <router-link class="link" to="/usuario">
            <q-icon name="assignment" /> Usuario
          </router-link>
          <router-link class="link" to="/ingresos">
            <q-icon name="people" /> Ingresos
          </router-link>
          <router-link class="link" to="/pagos">
            <q-icon name="people" /> Pagos
          </router-link>
        </template>

        <template v-if="userRole === 'admin'">
          <router-link class="link" to="/maquinaria">
            <q-icon name="build" /> Maquinaria
          </router-link>
        </template>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUsuarioStore } from "./stores/usuario.js";

const leftDrawerOpen = ref(false);
const useUsuario = useUsuarioStore();
const router = useRouter();

const userRole = computed(() => useUsuario.usuario.rol);
const userName = computed(() => useUsuario.usuario.nombre); // Nueva variable computada para el nombre del usuario

const logout = () => {
  useUsuario.clearSession();
  router.push("/"); // Redirigir a la página de inicio de sesión
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>


<style scoped>
.bg-custom-primary {
  background-color: #344860;
}

.drawer-menu {
  padding-top: 20px; /* Ajusta el espacio superior del menú */
  display: flex;
  flex-direction: column;
}

.link {
  display: flex;
  align-items: center;
  padding: 10px 30px;
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
}

.logout {
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  margin-right: 60px;
}

.link q-icon {
  margin-right: 10px;
}

.link:hover {
  background-color: #2c3a4e;
}

.link:hover q-icon {
  color: #ffeb3b; /* Cambia el color del icono al pasar el ratón */
}
</style>
