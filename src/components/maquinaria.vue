<template>
  <div id="ttt">
    <h2 class="title">Lista de Maquinaria</h2>

   

     <div
          style="
            width: 90%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          "
        >
          <q-btn color="green" class="ññ" @click="abrir(1)">Añadir Producto</q-btn>
        </div>
         <q-dialog v-model="alert" persistent>
          <q-card class="" style="width: 700px">
            <q-card-section
              style="background-color: #344860; margin-bottom: 20px"
            >
              <div class="text-h6 text-white">
                {{ accion == 1 ? "Agregar Instructor" : "Editar Instructor" }}
              </div>
            </q-card-section>

            <q-input
              outlined
              v-model="descripcion"
              label="Descripción"
              class="q-my-md q-mx-md"
              type="text"
            />
            <q-input
              outlined
              v-model="codigo"
              label="Código"
              class="q-my-md q-mx-md"
              type="number"
            />
            <q-select
              outlined
              v-model="idSede"
              label="Sede"
              class="q-my-md q-mx-md"
              :options="
                sedes.map((sede) => ({ label: sede.nombre, value: sede._id }))
              "
            />

            <q-input
              outlined
              v-model="fecha"
              label="Fecha"
              class="q-my-md q-mx-md"
              type="date"
            />
            <q-input
              outlined
              v-model="FechaUmantenimiento"
              label="Fecha de Último Mantenimiento"
              class="q-my-md q-mx-md"
              type="date"
            />

            <!-- Botones de acción -->
            <q-card-actions align="right">
              <q-btn
                @click="
                  accion === 1 ? agregarMaquina() : editarMaquina()
                "
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
    title="Maquinaria"
    :rows="rows"
    :columns="columns"
    row-key="_id"
    class="rounded-borders"
    dense
    style="width: 90%"
  >
    <template v-slot:head-top>
      <q-tr>
        <q-th
          v-for="column in columns"
          :key="column.name"
          :props="props"
          class="custom-table-header"
        >
          {{ column.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell-opciones="props">
      <div class="q-pa-md q-gutter-sm">
       
      </div>
      <q-btn @click="cargarDatosUsuario(props.row)">
        <span role="img" aria-label="Editar">✏️</span>
      </q-btn>
      <q-btn
        color="red"
        flat
        dense
        round
        icon="delete"
        @click="eliminarInventario(props.row)"
      />
      <q-td :props="props" class="q-pr-xs"> </q-td>
    </template>
  </q-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMaquinaStore } from "../stores/maquinaria.js";

let useMaquina = useMaquinaStore();
let alert = ref(false);
let rows = ref([]);
let columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },

  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  {
    name: "FechaUmantenimiento",
    label: "Fecha de Último Mantenimiento",
    align: "center",
    field: "FechaUmantenimiento",
  },
  { name: "estado", label: "estado", align: "center", field: "estado" },
  { name: "createAt", label: "Creado en", align: "center", field: "createAt" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);
let descripcion = ref("");
let codigo = ref("");
let idSede = ref("");
let fecha = ref("");
let FechaUmantenimiento = ref("");
let accion = ref(1);
let sedes = ref([]);
let currentId = ref(null); 
function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}
function cerrar() {
  alert.value = false;
}

let listarMaquinas = async () => {
  let response = await useMaquina.getMaquina();
  rows.value = response.maquinarias;
  // Obtener la lista de sedes y asignarla a la variable sedes
  let responseSedes = await useMaquina.getSede();
  sedes.value = responseSedes.sedes;
};
onMounted(() => {
  listarMaquinas();
});

const agregarMaquina = async () => {
  try {
    const idSedeValue = idSede.value; // Suponiendo que idSede.value es el objeto { label, value }
    const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;

    if (!idSedeSeleccionada) {
      console.error("Error: No se ha seleccionado una sede.");
      return;
    }

    await useMaquina.agregarMaquinaria({
      descripcion: descripcion.value,
      codigo: codigo.value,
      idSede: idSedeSeleccionada, // Pasar solo el _id de la sede
      fecha: fecha.value,
      FechaUmantenimiento: FechaUmantenimiento.value,
    });

    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al agregar maquinaria:", error);
  }
};
const cargarDatosUsuario = (usuario) => {
   currentId.value = usuario._id;
  descripcion.value = usuario.descripcion;
  codigo.value = usuario.codigo;
  idSede.value = usuario.idSede;
  fecha.value = formatDate(usuario.fecha);
  FechaUmantenimiento.value = formatDate(usuario.FechaUmantenimiento); 

  abrir(2);
};

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().substr(0, 10);
}
const editarMaquina = async (row) => {


  const idSedeValue = idSede.value;
  const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;
  try {
    await useMaquina.actualizarMaquina({
      _id:currentId.value,
      descripcion: descripcion.value,
      codigo: codigo.value,
      idSede: idSedeSeleccionada,
      fecha: fecha.value,
      FechaUmantenimiento: FechaUmantenimiento.value,
    });
    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al editar maquina:", error);
  }
};

onMounted(() => {
  listarMaquinas();
});
</script>

<style scoped>
.title {
  font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  border-bottom: 3px solid #344860;
  padding-top: 20px;
}

/* Estilos para la tabla */
.rounded-borders .q-table-container .q-table {
  border-radius: 12px;
  width: 100%; /* ajusta el ancho según sea necesario */
  margin: auto; /* esto centrará la tabla horizontalmente */
}

#ttt {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: "Roboto", sans-serif;
}
.q-page-container {
  width: 90%;
}
.ññ{
  top: -20px;
}
</style>
