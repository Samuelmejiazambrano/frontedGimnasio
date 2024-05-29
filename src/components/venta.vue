<template>
  <div id="sss">
    <h2 class="title">Lista de Venta</h2>

 

    <div class="q-pa-md" id="kk">
         <div
          style="
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          "
        >
          <q-btn color="green" class="nn" @click="abrir(1)">Añadir Producto</q-btn>
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
                <q-input
                  outlined
                  v-model="codigo"
                  label="Código"
                  class="q-my-md q-mx-md"
                  type="number"
                />
                <q-input
                  outlined
                  v-model="cantidad"
                  label="Cantidad"
                  class="q-my-md q-mx-md"
                  type="number"
                />
                <q-input
                  outlined
                  v-model="valorUnitario"
                  label="Valor Unitario"
                  class="q-my-md q-mx-md"
                  type="number"
                />
                <q-input
                  outlined
                  v-model="totalVentas"
                  label="Total Ventas"
                  class="q-my-md q-mx-md"
                  type="number"
                />
                <q-input
                  outlined
                  v-model="fechaInicio"
                  label="Fecha de Inicio"
                  class="q-my-md q-mx-md"
                  type="date"
                />
                <q-input
                  outlined
                  v-model="fechaFin"
                  label="Fecha de Fin"
                  class="q-my-md q-mx-md"
                  type="date"
                />

                <q-card-actions align="right">
                  <q-btn
                    @click="
                      accion === 1 ? agregarVentas() : editarVenta()
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
        title="Ventas"
        title-class=" text-weight-bolder text-h5"
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
         
            
            <q-btn @click="cargarDatosVenta(props.row)">
              <span role="img" aria-label="Editar">✏️</span>
            </q-btn>
            <!-- <q-btn @click="desactivarSede(props.row)">
                <span role="img" aria-label="Desactivar">❌</span>
              </q-btn>
              <q-btn @click="activarSede(props.row)">
                <span role="img" aria-label="Activar">✅</span>
              </q-btn> -->
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useVentaStore } from "../stores/venta.js";
let alert = ref(false);
let sedes = ref([]);
let codigo = ref("");
let cantidad = ref("");
let valorUnitario = ref("");
let totalVentas = ref("");
let fechaInicio = ref("");
let fechaFin = ref("");
let accion = ref(1);
let currentId = ref(null); 
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

let useVenta = useVentaStore();

let rows = ref([]);
let columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  {
    name: "valorUnitario",
    label: "Valor Unitario",
    align: "center",
    field: "valorUnitario",
  },
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
  let response = await useVenta.getVenta();
  rows.value = response.ventas;

  console.log(response);
};
const agregarVentas = async () => {
  try {
    await useVenta.agregarVenta({
      codigo: codigo.value,
      cantidad: cantidad.value,
      valorUnitario: valorUnitario.value,
      totalVentas: totalVentas.value,
      fechaInicio: fechaInicio.value,
      fechaFin: fechaFin.value,
    });
    cerrar();
    listarMaquinas();
    Notify.create(" agregada venta");
  } catch (error) {
    console.error("Error al agregar venta:", error);
    Notify.create("Error al agregar venta");
  }
};

const cargarDatosVenta = (venta) => {
    currentId.value = venta._id;

  codigo.value = venta.codigo;
  cantidad.value = venta.cantidad;
  valorUnitario.value = venta.valorUnitario;
  totalVentas.value = venta.totalVentas;
  fechaInicio.value = formatDate(venta.fechaInicio);
  fechaFin.value = formatDate(venta.fechaFin);
  abrir(2);
};

const editarVenta = async (row) => {

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
    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al editar venta:", error);
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
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
  color: white;
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
.nn{
  top: -30px;
}
#kk{
  font-family: "Roboto", sans-serif;
  width: 100%;
}
</style>