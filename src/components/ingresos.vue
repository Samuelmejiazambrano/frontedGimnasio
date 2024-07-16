<template>
  <div id="sss">
    <h2 class="title">Lista de Ingresos</h2>

    <div class="q-pa-md" id="oo">
      <div class="btn">
        <q-select
          class="select"
          v-model="selectedSedeId"
          :options="options"
          label="Seleccionar Ingreso"
        />
        <q-btn color="green" icon="search" @click="buscarIngreso">
          <q-tooltip>Buscar Ingreso</q-tooltip>
        </q-btn>
        <q-btn color="green" @click="abrir(1)">
          <q-tooltip>Añadir Ingreso</q-tooltip>
          Añadir Ingreso
        </q-btn>
      </div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Ingresos" : "Editar Ingresos" }}
            </div>
          </q-card-section>
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
            label="Sedes"
            class="q-my-md q-mx-md"
            :options="
              sedesList.map((sedes) => ({
                label: sedes.nombre,
                value: sedes._id,
              }))
            "
          />

          <q-select
            outlined
            v-model="idCliente"
            label="Cliente"
            class="q-my-md q-mx-md"
            :options="
              clientesList.map((clientes) => ({
                label: clientes.nombre,
                value: clientes._id,
              }))
            "
          />

          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarIngreso() : editarIngreso()"
              color="red"
              class="text-white"
            >
              <q-tooltip>{{ accion === 1 ? "Agregar" : "Editar" }}</q-tooltip>
              {{ accion === 1 ? "Agregar" : "Editar" }}
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar">
              <q-tooltip>Cerrar</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-table
        title="Ingresos"
        title-class="text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders"
        :loading="loading"
        dense
      >
        <template v-slot:head-top>
          <q-tr>
            <q-th
              v-for="column in columns"
              :key="column.name"
              :props="props"
              style="background-color: orange; color: white; font-weight: bold"
            >
              {{ column.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-createAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createAt) }}
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="q-pr-xs">
            <q-btn @click="cargarDatosIngresos(props.row)">
              <q-tooltip>Editar</q-tooltip>
              <span role="img" aria-label="Editar">✏️</span>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import moment from "moment";
import "moment/locale/es";
import { useIngresoStore } from "../stores/ingreso.js";
let loading = ref(false);
let alert = ref(false);
let sede = ref([]);
let cliente = ref([]);
let codigo = ref("");
let idSede = ref("");
let idCliente = ref("");
let accion = ref(1);
let currentId = ref(null);
let sedesList = ref([]);
let clientesList = ref([]);
let selectedSedeId = ref(null);
let options = ref([]);

function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
  limpiar();
}

function limpiar() {
  codigo.value = "";
  idSede.value = "";
  idCliente.value = "";
}

let useIngreso = useIngresoStore();

let rows = ref([]);
let columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  {
    name: "cliente",
    label: "Cliente",
    align: "center",
    field: (row) => row.cliente.nombre,
  },
  {
    name: "sede",
    label: "Sede",
    align: "center",
    field: (row) => row.sede.ciudad,
  },
  { name: "createAt", label: "Creado en", align: "center", field: "createAt" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let listarMaquinas = async () => {
  loading.value = true;

  try {
    let response = await useIngreso.getIngreso();
    let ingresos = response.ingresos || [];

    let responseSedes = await useIngreso.getSede();
    sedesList = responseSedes.sedes || [];

    let responseClientes = await useIngreso.getCliente();
    clientesList = responseClientes.cliente || [];
    console.log("sedesList:", sedesList);
    console.log("clientesList:", clientesList);

    rows.value = ingresos.map((ingreso) => {
      let sede = sedesList.find((s) => s._id === ingreso.sede);
      let cliente = clientesList.find((c) => c._id === ingreso.cliente);
      return {
        ...ingreso,
        nombreSede: sede ? sede.nombre : "N/A",
        nombreCliente: cliente ? cliente.nombre : "N/A",
      };
    });
    options.value = response.ingresos.map((ingreso) => ({
      label: `${ingreso.cliente.nombre} - ${ingreso.cliente.cc}`,
      value: ingreso._id,
    }));
  } catch (error) {
    console.error("Error al listar los datos:", error);
  } finally {
    loading.value = false;
  }
};
const agregarIngreso = async () => {
  const idSedeValue = idSede.value;
  const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;
  const idclienteValue = idCliente.value;
  const idclienteSeleccionada = idclienteValue ? idclienteValue.value : null;

  if (!codigo.value) {
    Notify.create("Por favor ingrese el código");
    return;
  } else if (!idSede.value) {
    Notify.create("Por favor seleccione una sede");
    return;
  } else if (!idCliente.value) {
    Notify.create("Por favor seleccione un cliente");
    return;
  } else {
    loading.value = true;
    try {
      await useIngreso.postIngreso({
        codigo: codigo.value,
        sede: idSedeSeleccionada,
        cliente: idclienteSeleccionada,
      });
      Notify.create({
        message: "Ingreso Agregado",
        color: "green",
      });
      cerrar();
      listarMaquinas();
    } catch (error) {
      console.error("Error al agregar ingreso:", error);
      if (error && error.message && error.message.includes("código duplicado")) {
        Notify.create({
          message: "El código ingresado ya existe",
          color: "red",
        });
      } else {
        Notify.create({
          message: "Error al agregar ingreso",
          color: "red",
        });
      }
    } finally {
      loading.value = false;
    }
  }
};


const editarIngreso = async () => {
  loading.value = true;
  const idSedeValue = idSede.value;
  const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;
  const idclienteValue = idCliente.value;
  const idclienteSeleccionada = idclienteValue ? idclienteValue.value : null;
  try {
    await useIngreso.actualizarIngreso({
      _id: currentId.value,
      codigo: codigo.value,
      sede: idSedeSeleccionada,
      cliente: idclienteSeleccionada,
    });
    Notify.create({
      message: "Ingresos Editado",
      color: "green",
    });
    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al editar ingreso:", error);
  }
  loading.value = false;
};

const cargarDatosIngresos = (ingreso) => {
  currentId.value = ingreso._id;
  codigo.value = ingreso.codigo;
  idSede.value = ingreso.sede.ciudad;
  idCliente.value = ingreso.cliente.nombre;
  abrir(2);
};

const buscarIngreso = async () => {
  loading.value = true;

  try {
    if (selectedSedeId.value) {
      const res = await useIngreso.getIngresoID(selectedSedeId.value.value);
      if (res && res.ingresos) {
        rows.value = [res.ingresos];
        Notify.create({
          message: "Ingreso Encontrado",
          color: "green",
        });
      } else {
        Notify.create("No se encontró la sede");
      }
    } else {
      Notify.create("Por favor ingrese un ID de sede");
    }
  } catch (error) {
    console.error("Error al buscar la sede:", error);
    Notify.create("Error al buscar la sede");
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  return moment(date).format("dddd, D MMMM YYYY");
};

onMounted(() => {
  listarMaquinas();
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
#sss {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#oo {
  font-family: sans-serif;
  width: 90%;
}
.ii {
  top: -20px;
}
.btn {
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 10px !important;
  width: 100%;
  margin-top: 20px;
}
.select {
  width: 300px;
}
.btn > * {
  border-radius: 30px;
}
</style>
