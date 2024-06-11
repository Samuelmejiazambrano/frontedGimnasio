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
        Buscar Ingreso
      </q-btn>
        <q-btn color="green"  @click="abrir(1)">Añadir Producto</q-btn>
      </div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section style="background-color: #344860; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Instructor" : "Editar Instructor" }}
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
  label="Cliente"
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
              {{ accion === 1 ? "Agregar" : "Editar" }}
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar" />
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
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="q-pr-xs">
            <q-btn @click="cargarDatosIngresos(props.row)">
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

import { useIngresoStore } from "../stores/ingreso.js";

let alert = ref(false);
let sede= ref([]);
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
  { name: "codigo", label: "codigo", align: "center", field: "codigo" },
  { name: "nombreCliente", label: "Cliente", align: "center", field: "nombreCliente" },
  { name: "nombreSede", label: "Sede", align: "center", field: "nombreCliente" }, // Corregido el nombre del campo
  { name: "createAt", label: "Creado en", align: "center", field: "createAt" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);



let listarMaquinas = async () => {
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
    options.value =response.ingresos.map((ingreso) => ({
    label: ingreso.cliente,
    value: ingreso._id,
  }));
  } catch (error) {
    console.error("Error al listar los datos:", error);
  }
};


const agregarIngreso = async () => {
 const idSedeValue = idSede.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;
  const idclienteValue = idCliente.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idclienteSeleccionada = idclienteValue ? idclienteValue.value : null;
  try {
    await useIngreso.postIngreso({
      codigo: codigo.value,
      sede: idSedeSeleccionada,
      cliente: idclienteSeleccionada,
    });
    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al agregar ingreso:", error);
  }
};

const editarIngreso = async () => {
  try {
    await useIngreso.actualizarIngreso({
      _id: currentId.value,
      codigo: codigo.value,
      sede: idSede.value,
      cliente: idCliente.value,
    });
    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al editar ingreso:", error);
  }
};

const cargarDatosIngresos = (ingreso) => {
  currentId.value = ingreso._id;
  codigo.value = ingreso.codigo;
  idSede.value = ingreso.sede;
  idCliente.value = ingreso.cliente;
  abrir(2);
};
const buscarIngreso = async () => {
  try {
    if (selectedSedeId.value) {
      const res = await useIngreso.getIngresoID(selectedSedeId.value.value);
      console.log(selectedSedeId);
      if (res && res.ingresos) {
        rows.value = [res.ingresos];
        Notify.create("ingresos encontrada");
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
#oo{
  font-family:sans-serif;
  width: 90%;
}
.ii{
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
.select{
width: 300px;
}
.btn >*{
   border-radius: 30px;
}
</style>
