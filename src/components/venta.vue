<template>
  <div id="sss">
    <h2 class="title">Lista de Venta</h2>

    <div class="q-pa-md" id="kk">
      <div class="btn">
        <q-select
          class="select"
          v-model="selectedSedeId"
          :options="options"
          label="Seleccionar Producto"
        />
        <q-btn color="green" icon="search" @click="buscarVenta">
          <q-tooltip>Buscar las ventas de la sede seleccionada</q-tooltip>
        </q-btn>
        <q-btn color="green" @click="abrir(1)">
          Añadir Venta
          <q-tooltip>Añadir un nuevo producto a la lista de ventas</q-tooltip>
        </q-btn>
      </div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Venta" : "Editar Venta" }}
            </div>
          </q-card-section>
          <q-select
            outlined
            v-model="codigo"
            label="Código"
            class="q-my-md q-mx-md"
            :options="inventarioOptions"
            option-label="descripcion"
            option-value="_id"
          />
          <q-input
            outlined
            v-model="cantidad"
            label="Cantidad"
            class="q-my-md q-mx-md"
            type="number"
          />
       
       
       
          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarVentas() : editarVenta()"
              color="red"
              class="text-white"
            >
              {{ accion === 1 ? "Agregar" : "Editar" }}
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
              <q-tooltip>{{
                accion === 1
                  ? "Agregar una nueva venta"
                  : "Editar la venta seleccionada"
              }}</q-tooltip>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar">
              <q-tooltip>Cerrar el diálogo</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-table
        title="Ventas"
        title-class=" text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders"
        :loading="loading"
        dense
      >
        <template v-slot:body-cell-fechaInicio="props">
          <q-td :props="props">
            {{ moment(props.row.fechaInicio).format("dddd, D MMMM YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-fechaFin="props">
          <q-td :props="props">
            {{ moment(props.row.fechaFin).format("dddd, D MMMM YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-createAt="props">
          <q-td :props="props">
            {{ moment(props.row.createAt).format("dddd, D MMMM YYYY") }}
          </q-td>
        </template>
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
            <q-btn @click="cargarDatosVenta(props.row)">
              <span role="img" aria-label="Editar">✏️</span>
              <q-tooltip>Editar esta venta</q-tooltip>
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
import { useVentaStore } from "../stores/venta.js";
let loading = ref(false);
let alert = ref(false);
let codigo = ref("");
let cantidad = ref("");
let valorUnitario = ref("");
let totalVentas = ref("");
let fechaInicio = ref("");
let fechaFin = ref("");
let accion = ref(1);
let currentId = ref(null);
let options = ref([]);
let selectedSedeId = ref(null);
function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}

let useVenta = useVentaStore();
let rows = ref([]);
let inventarioOptions = ref([]);
let columns = ref([
  {
    name: "codigoProducto",
    label: "Código",
    align: "center",
    field: (row) => row.codigoProducto.descripcion,
  },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  
  {
    name: "totalVentas",
    label: "Total Ventas",
    align: "center",
    field: "totalVentas",
  },
  {
    name: "fechaInicio",
    label: "Fecha de Inicio",
    align: "center",
    field: "fechaInicio",
  },
  {
    name: "fechaFin",
    label: "Fecha de Fin",
    align: "center",
    field: "fechaFin",
  },
  { name: "createAt", label: "Creado en", align: "center", field: "createAt" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let listarMaquinas = async () => {
  loading.value = true;
  try {
    let response = await useVenta.getVenta();
    rows.value = response.ventas;
    options.value = response.ventas.map((venta) => ({
      label: venta.codigoProducto.descripcion,
      value: venta._id,
    }));
  } catch {
    console.log("error");
  }finally{
    loading.value = false;

  }
};

let listarInventario = async () => {
  let response = await useVenta.getInventario();
  inventarioOptions.value = response.inventarios; // Ajusta esto según tu respuesta
};

const agregarVentas = async () => {
  if (codigo.value.length <= 3) {
    Notify.create("por favor ingrese el codigo ");
  } else if (cantidad.value == "") {
    Notify.create("por favor ingrese la cantidad");
  }else {
    loading.value = true;
    try {
      await useVenta.agregarVenta({
        codigoProducto: codigo.value,
        cantidad: cantidad.value,
        totalVentas: totalVentas.value,
      
      });
      cerrar();
      listarMaquinas();
      Notify.create({
        message: "Venta agregada",
        color: "green",
      });
    } catch (error) {
      console.error("Error al agregar venta:", error);
      Notify.create("Error al agregar venta");
    } finally {
      loading.value = false;
    }
  }
};

const cargarDatosVenta = (venta) => {
  currentId.value = venta._id;
  codigo.value = venta.codigoProducto;
  cantidad.value = venta.cantidad;
  valorUnitario.value = venta.valorUnitario;
  totalVentas.value = venta.totalVentas;
  fechaInicio.value = formatDate(venta.fechaInicio);
  fechaFin.value = formatDate(venta.fechaFin);
  abrir(2);
};

const editarVenta = async () => {
  loading.value = true;
  try {
    await useVenta.actualizarVenta({
      _id: currentId.value,
      codigo: codigo.value,
      cantidad: cantidad.value,
      valorUnitario: valorUnitario.value,
      totalVentas: totalVentas.value,
      fechaInicio: fechaInicio.value,
      fechaFin: fechaFin.value,
    });
      Notify.create({
        message: "Venta Editada",
        color: "green",
      });
    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al editar venta:", error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};
const buscarVenta = async () => {
  loading.value = true;

  try {
    if (selectedSedeId.value) {
      const res = await useVenta.getVentaID(selectedSedeId.value.value);
      if (res && res.ventas) {
        rows.value = [res.ventas];
          Notify.create({
        message: "ventas encontrada",
        color: "green",
      });
      } else {
        Notify.create("No se encontró la ventas");
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
onMounted(() => {
  listarMaquinas();
  listarInventario();
});
</script>

<style scoped>
.title {
  font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  border-bottom: 3px solid #344860;
  padding-top: 20px;
  font-weight: 900;
}

.custom-table-header .q-table-header {
  background-color: #344860;
  color: white;
}

.rounded-borders .q-table-container .q-table {
  border-radius: 8px;
}

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

.nn {
  top: -30px;
}

#kk {
  font-family: "Roboto", sans-serif;
  width: 90%;
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
