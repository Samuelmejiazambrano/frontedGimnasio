<template>
  <div id="zzz">
    <h2 class="title">Lista de Sedes</h2>
        <div class="q-pa-md" id="cont">

    <div class="btn">
   
         <q-select
         class="select"
          v-model="selectedSedeId"
          :options="options"
          label="Seleccionar Cliente"
        />
      <q-btn color="green" class="qqq" icon="search" @click="buscarSede">
        Buscar Sede
      </q-btn>
      <q-btn color="green" class="qqq" icon="add_location" @click="abrir(1)">
        agregar
      </q-btn>
      <q-btn color="primary" class="sa" @click="listarIngesos()">
        Listar Usuarios
      </q-btn>
      <q-btn color="primary" class="sa" @click="listarSedeActivos()">
        Listar Sedes Activos
      </q-btn>
      <q-btn color="primary" class="sa" @click="listarSedeInactivo()">
        Listar Sedes Inactivos
      </q-btn>
    </div>
    <div style="width: 150vh">
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #344860; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Instructor" : "Editar Instructor" }}
            </div>
          </q-card-section>
          <q-input
            outlined
            v-model="codigo"
            label="Codigo"
            class="q-my-md q-mx-md"
            type="number"
          />
          <q-input
            outlined
            v-model="nombre"
            label="Nombre de la Sede"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="direccion"
            label="Dirrecion de la Sede"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="hora"
            label="Horario"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="ciudad"
            label="Ciudad de la Sede"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="telefono"
            type="tel"
            label="Telefono"
            class="q-my-md q-mx-md"
          />
          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarSede() : editarSede()"
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
      <div class="q-pa-md">
        <q-table
          title="Sedes"
          :rows="rows"
          :columns="columns"
          row-key="_id"
          class="tabla"
        >
          <template v-slot:body-cell-createAt="props">
            <q-td :props="props">
              {{ moment(props.row.createAt).format("dddd, D MMMM YYYY") }}
            </q-td>
          </template>
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
      </div>
    </div>
  </div>
    </div>

</template>


<script setup>
import { ref, onMounted } from "vue";
import { useSedeStore } from "../stores/sede.js";
import moment from "moment";
import "moment/locale/es";
import { Notify } from "quasar";

let alert = ref(false);
let nombre = ref("");
let correo = ref("");
let direccion = ref("");
let codigo = ref("");
let hora = ref("");
let ciudad = ref("");
let telefono = ref("");
let accion = ref(1);
let currentId = ref(null);
let selectedSedeId = ref(null);
let options = ref([]); // Declaramos una referencia para las opciones del select


let useSede = useSedeStore();

let rows = ref([]);
let columns = ref([
  { name: "nombre", label: "nombre", align: "center", field: "nombre" },
  {
    name: "direccion",
    label: "direccion",
    align: "center",
    field: "direccion",
  },
  { name: "horario", label: "horario", align: "center", field: "horario" },
  { name: "ciudad", label: "ciudad", align: "center", field: "ciudad" },
  { name: "createAt", label: "createAt", align: "center", field: "createAt" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let r = null;

let listarIngesos = async () => {
  r = await useSede.getSede();
  rows.value = r.sedes;
  options.value = r.sedes.map((sedes) => ({
    label: sedes.nombre,
    value: sedes._id,
  }));
  console.log(r);
};

const listarSedeActivos = async () => {
  try {
    const res = await useSede.getSedeActivos();
    rows.value = res.sedes;
  } catch (error) {
    console.error("Error al listar sedes activas:", error);
    Notify.create("Error al obtener sedes activas");
  }
};

const listarSedeInactivo = async () => {
  try {
    const res = await useSede.getSedeInactivos();
    rows.value = res.sedes;
  } catch (error) {
    console.error("Error al listar sedes inactivas:", error);
    Notify.create("Error al obtener sedes inactivas");
  }
};

const buscarSede = async () => {
  try {
    if (selectedSedeId.value) {
      const res = await useSede.getSedeID(selectedSedeId.value.value);
      if (res && res.sedes) {
        rows.value = [res.sedes];
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

function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}

let expresiontel = /^\d{8,}$/;
let verifitel = expresiontel.test(telefono.value);

const agregarSede = async () => {
  if (codigo.value == "") {
    Notify.create("Por favor ingrese su codigo");
  } else if (nombre.value == "") {
    Notify.create("Por favor ingrese el nombre");
  } else if (direccion.value == "") {
    Notify.create("Por favor ingrese la direccion");
  } else if (telefono.value.length !== 10) {
    Notify.create("El teléfono debe tener exactamente 10 números");
  } else if (hora.value == "") {
    Notify.create("Por favor ingrese el horario");
  } else if (ciudad.value == "") {
    Notify.create("Por favor ingrese la ciudad");
  } else {
    try {
      await useSede.agregarSede({
        nombre: nombre.value,
        direccion: direccion.value,
        codigo: codigo.value,
        horario: hora.value,
        ciudad: ciudad.value,
        telefono: telefono.value,
      });
      cerrar();
      listarIngesos();
    } catch (error) {
      console.error("Error al agregar la sede:", error);
      Notify.create("Error al agregar la sede");
    }
  }
};

const cargarDatosUsuario = (usuario) => {
  currentId.value = usuario._id;
  nombre.value = usuario.nombre;
  direccion.value = usuario.direccion;
  codigo.value = usuario.codigo;
  hora.value = usuario.horario;
  ciudad.value = usuario.ciudad;
  telefono.value = usuario.telefono;
  abrir(2);
};

const editarSede = async () => {
  if (codigo.value == "") {
    Notify.create("Por favor ingrese su codigo");
  } else if (nombre.value == "") {
    Notify.create("Por favor ingrese el nombre");
  } else if (direccion.value == "") {
    Notify.create("Por favor ingrese la direccion");
  } else if (telefono.value == "") {
    Notify.create("Por favor ingrese el telefono");
  } else if (hora.value == "") {
    Notify.create("Por favor ingrese el horario");
  } else if (ciudad.value == "") {
    Notify.create("Por favor ingrese la ciudad");
  } else {
    try {
      await useSede.actualizarSede({
        _id: currentId.value,
        nombre: nombre.value,
        direccion: direccion.value,
        codigo: codigo.value,
        horario: hora.value,
        ciudad: ciudad.value,
        telefono: telefono.value,
      });
      cerrar();
      listarIngesos();
    } catch (error) {
      console.error("Error al editar la sede:", error);
      Notify.create("Error al editar la sede");
    }
  }
};

const desactivarSede = async (plan) => {
  try {
    if (plan && plan._id) {
      await useSede.desactivarSede(plan);
      Notify.create("Sede desactivada correctamente");
      listarIngesos();
    } else {
      Notify.create("Sede no válida");
    }
  } catch (error) {
    console.error("Error al desactivar la sede:", error);
    Notify.create("Error al desactivar la sede");
  }
};

const activarSede = async (plan) => {
  try {
    if (plan && plan._id) {
      await useSede.activarSede(plan);
      Notify.create("Sede activada correctamente");
      listarIngesos();
    } else {
      Notify.create("Sede no válida");
    }
  } catch (error) {
    console.error("Error al activar la sede:", error);
    Notify.create("Error al activar la sede");
  }
};

const togglePlanStatus = async (plan) => {
  try {
    if (plan.estado === 1) {
      await desactivarSede(plan);
    } else {
      await activarSede(plan);
    }
  } catch (error) {
    console.error("Error al cambiar el estado de la sede:", error);
    Notify.create("Error al cambiar el estado de la sede");
  }
};

onMounted(() => {
  listarIngesos();
});
</script>


<style scoped>
/* Estilos para el título */
.title {
  font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  border-bottom: 3px solid #344860;
  padding-top: 20px;
  font-weight: 900;
}

/* Estilos para la cabecera de la tabla */
.custom-table-header .q-table-header {
  background-color: #344860;
  color: white; /* Cambia el color del texto si es necesario */
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
#zzz {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: "Roboto", sans-serif;
}
.select{
width: 300px;
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
 align-items: flex-end;
  gap: 10px;
}
.btn >*{
   border-radius: 30px;
}
</style>
