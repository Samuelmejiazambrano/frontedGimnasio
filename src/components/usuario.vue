<style>
.desktop
  #app
  .q-layout
  .q-page-container
  #aaa
  .q-pa-md
  .q-table__container
  .q-table__middle
  thead
  .q-table
  th {
  font-size: 25px;
}
</style>

<template>
  <div id="aaa">
    <h2 class="title">Lista de Usuarios</h2>

    <div class="q-pa-md" id="rr">
      <div class="btn">
   <q-select
    v-model="selectedSedeId"
    :options="options"
    label="Seleccionar Cliente"
    class="select"
  />
  <q-btn color="green" class="bb" icon="search" @click="buscarUsuario">
    Buscar Sede
  </q-btn>
  <q-btn color="primary" class="bb" @click="listarUsuariosActivos()">
    Listar Usuarios Activos
  </q-btn>
  <q-btn color="primary" class="bb" @click="listarUsuariosInactivo()">
    Listar Usuarios Inactivos
  </q-btn>
  <q-btn color="primary" class="bb" @click="listarIngesos()">Listar Usuarios</q-btn>
  <q-btn color="green" class="bb" @click="abrir(1)">Añadir Usuario</q-btn>
</div>


      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Usuario" : "Editar Usuario" }}
            </div>
          </q-card-section>
          <q-input
            outlined
            v-model="nombre"
            label="Nombre"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="sede"
            label="Sede"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="email"
            label="Email"
            class="q-my-md q-mx-md"
            type="email"
          />
          <q-input
            outlined
            v-model="direccion"
            label="Dirección"
            class="q-my-md q-mx-md"
            type="text"
          />

          <q-input
            outlined
            v-model="telefono"
            label="Teléfono"
            class="q-my-md q-mx-md"
            type="tel"
          />
          <q-select
            outlined
            v-model="rol"
            label="Rol"
            class="q-my-md q-mx-md"
            :options="roles"
            option-label="label"
            option-value="value"
          />
          <q-input
            outlined
            v-model="password"
            label="Password"
            class="q-my-md q-mx-md"
            type="password"
          />
          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarUsuario() : updateUsuario()"
              color="red"
              class="text-white"
            >
              {{ accion === 1 ? "Agregar" : "Editar" }}
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-table
        q-table
        :table-row-class="tabla"
        :rows="rows"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <p :style="{ color: props.row.estado == 1 ? 'green' : 'red' }">
              {{ props.row.estado == 1 ? "Activo" : "Inactivo" }}
            </p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="cargarDatosUsuario(props.row)">
              <span role="img" aria-label="Editar">✏️</span>
            </q-btn>
            <q-btn @click="togglePlanStatus(props.row)">
              <span role="img" aria-label="Toggle">
                {{ props.row.estado == 1 ? "❌" : "✅" }}
              </span>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <!-- </q-table> -->
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useUsuarioStore } from "../stores/usuario.js";

let nombre = ref("");
let sede = ref("");
let email = ref("");
let direccion = ref("");
let telefono = ref("");
let rol = ref("");
let options = ref([]);
let selectedSedeId = ref(null);
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

let rows = ref([]);
let columns = ref([
  { name: "sede", label: "Sede", align: "center", field: "sede" },
  { name: "nombre", label: "Nombre", align: "center", field: "nombre" },
  { name: "email", label: "Email", align: "center", field: "email" },
  {
    name: "direccion",
    label: "Dirección",
    align: "center",
    field: "direccion",
  },
  { name: "telefono", label: "Teléfono", align: "center", field: "telefono" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "rol", label: "Rol", align: "center", field: "rol" },

  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let r = null;

let listarIngesos = async () => {
  r = await useUsuario.getUsuario();

  rows.value = r.usuario;

  options.value = r.usuario.map((usuarios) => ({
    label: usuarios.nombre,
    value: usuarios._id,
  }));
  console.log(r);
};
let alert = ref(false);
// function cerrardiv() {
//   alert.value = false;
//   limpiar();
// }

function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}
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

      cerrar();
      listarIngesos();
    } catch (error) {
      console.error("Error al agregar inventario:", error);
    }
  }
};
const listarUsuariosActivos = async () => {
  try {
    const res = await useUsuario.getUsuarioActivos();
    rows.value = res.usuarios;
    Notify.create("Error al obtener usuarios activos");
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  }
};
const listarUsuariosInactivo = async () => {
  try {
    const res = await useUsuario.getUsuarioInactivos();
    rows.value = res.usuarios;
    Notify.create("Error al obtener usuarios activos");
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  }
};
const desactivarUsuario = async (usuario) => {
  try {
    if (usuario && usuario._id) {
      await useUsuario.desactivarUsuarios(usuario);
      Notify.create("Usuario desactivado correctamente");
      listarIngesos();
    } else {
      Notify.create("Usuario no válido");
    }
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    Notify.create("Error al desactivar usuario");
  }
};
const activarUsuario = async (usuario) => {
  try {
    if (usuario && usuario._id) {
      await useUsuario.activarUsuarios(usuario);
      Notify.create("Usuario desactivado correctamente");
      listarIngesos(); // Actualizar la lista de usuarios después de desactivar uno
    } else {
      Notify.create("Usuario no válido");
    }
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    Notify.create("Error al desactivar usuario");
  }
};
const cargarDatosUsuario = (usuario) => {
  currentId.value = usuario._id;
  nombre.value = usuario.nombre;
  sede.value = usuario.sede;
  email.value = usuario.email;
  direccion.value = usuario.direccion;
  telefono.value = usuario.telefono;
  rol.value = usuario.rol;

  abrir(2);
};

const updateUsuario = async (props) => {
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
  } else {
    try {
      await useUsuario.UpdateUsuarios({
        _id: currentId.value,
        nombre: nombre.value,
        sede: sede.value,
        email: email.value,
        direccion: direccion.value,
        telefono: telefono.value,
        rol: rol.value,
      });

      cerrar();
      listarIngesos();
    } catch (error) {
      Notify.create("Error al actualizar usuario");
    }
  }
};
const togglePlanStatus = async (usuario) => {
  try {
    if (usuario.estado === 1) {
      await desactivarUsuario(usuario);
    } else {
      await activarUsuario(usuario);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del plan:", error);
    Notify.create("Error al cambiar el estado del plan");
  }
};
const buscarUsuario = async () => {
  try {
    if (selectedSedeId.value) {
      const res = await useUsuario.getusuarioID(selectedSedeId.value.value);
      if (res && res.usuario) {
        rows.value = [res.usuario];
        Notify.create("Sede encontrada");
      } else {
        Notify.create("No se encontró la sede");
      }
    } else {
      Notify.create("Por favor ingrese un ID de sede");
    }
  } catch (error) {
    console.error("Error al buscar la sede:", error);
    Notify.create("Error al buscar la sede");
  }
};
onMounted(() => {
  listarIngesos();
});
</script>
<style scoped>
.q-table {
  /*#app .q-layout .q-page-container #aaa .q-pa-md .q-table__container .q-table__middle thead .q-table th{*/
  background-color: aqua !important;
}
/* Estilos para el título */
.title {
  font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  border-bottom: 3px solid #b31919;
  padding-top: 20px;
  font-weight: 900;
}

/* Estilos para la tabla */
.rounded-borders .q-table-container .q-table {
  border-radius: 8px;
}

/* Estilos para los botones de opciones */
.q-table-body .q-btn {
  min-width: 32px;
}

.q-table-body .q-btn .q-icon {
  font-size: 18px;
}
.tabla {
  margin-bottom: 150px;
  width: 100%;
}
#aaa {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.bb {
  top: -20px;
}
#rr {
  font-family: "Roboto", sans-serif;
  width: 100%;
}
/* Estilos para los botones */
.bb {
  margin: 5px; /* Espaciado entre los botones */
  font-size: 16px; /* Tamaño del texto de los botones */
  border-radius: 8px; /* Bordes redondeados para los botones */
}

/* Alineación vertical de los botones en su contenedor */

/* Estilo específico para los botones de acción */
.q-table-body .q-btn {
  min-width: 40px; /* Ajustar el ancho mínimo */
}

/* Iconos dentro de los botones */
.q-table-body .q-btn .q-icon {
  font-size: 20px; /* Tamaño de los iconos */
}
.btn {
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-end !important;
  align-items: flex-end !important;
  gap: 10px !important;
}
.q-table th {
  position: relative;
  font-size: 25px !important;
}
/* Estilos para el select */
.select {
  min-width: 300px; /* Ajusta el ancho mínimo según tus necesidades */
  font-size: 16px; /* Tamaño de fuente */
  border-radius: 8px; /* Bordes redondeados */
  height: 80px;
}

/* Estilo para el icono desplegable del select */
.q-select .q-field__native .q-field__bottom-right .q-field__append .q-select__dropdown-icon {
  font-size: 20px; /* Tamaño del icono */
}
.btn >*{
   border-radius: 30px;
}
</style>
