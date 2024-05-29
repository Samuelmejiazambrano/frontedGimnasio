<template>
  <div class="sss">
    <h2 class="title">Lista de Pagos</h2>

    <div class="q-pa-md q-gutter-sm" id="cc">
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
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
            v-model="idPagos"
            label="Pagos"
            class="q-my-md q-mx-md"
            :options="
              plan.map((planes) => ({
                label: planes.descripcion,
                value: planes._id,
              }))
            "
          />
          <q-select
            outlined
            v-model="idCliente"
            label="Cliente"
            class="q-my-md q-mx-md"
            :options="
              clientes.map((cliente) => ({
                label: cliente.nombre,
                value: cliente._id,
              }))
            "
          />
          <q-input
            outlined
            v-model="valor"
            label="Valor"
            class="q-my-md q-mx-md"
            type="number"
          />

          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarPagos() : editarPagos()"
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
    </div>

    <div class="q-pa-md">
      <div
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        "
      
      >
        <q-btn color="green" class="ff" @click="abrir(1)">Añadir Producto</q-btn>
      </div>
      <q-table
        title="Pagos"
        title-class="text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders"
        dense
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="q-pr-xs">
            <q-btn @click="cargarDatosPago(props.row)">
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
import { usePagoStore } from "../stores/pago.js";

let alert = ref(false);
let codigo = ref("");
let idPagos = ref(""); 
let idCliente = ref("");
let valor = ref("");
let accion = ref(1);
let clientes = ref([]);
let plan = ref([]);
let currentId = ref(null); 

let usePago = usePagoStore();

let rows = ref([]);
let columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  { name: "plan", label: "plan", align: "center", field: "plan" },
  { name: "valor", label: "Valor ", align: "center", field: "valor" },
  {
    name: "idCliente",
    label: "idCliente",
    align: "center",
    field: "idCliente",
  },

  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

// Función para abrir el diálogo de agregar/Editar
function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}

const agregarPagos = async () => {
  const idPagosValue = idPagos.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idPagosSeleccionada = idPagosValue ? idPagosValue.value : null;
  const idclienteValue = idCliente.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idclienteSeleccionada = idclienteValue ? idclienteValue.value : null;
  try {
    await usePago.agregarPago({
      codigo: codigo.value,
      plan: idPagosSeleccionada,
      idCliente: idclienteSeleccionada,
      valor: valor.value,
    });
    cerrar();
    listarPagos();
    Notify.create("Venta agregada exitosamente");
  } catch (error) {
    console.error("Error al agregar venta:", error);
    Notify.create("Error al agregar venta");
  }
};


let listarPagos = async () => {
  try {
    let response = await usePago.getPago();
    rows.value = response.pagos;
    let responseCliente = await usePago.getCliente();
    clientes.value = responseCliente.cliente;

    let responsePlan = await usePago.getPlan();
    plan.value = responsePlan.planes;
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    Notify.create("Error al obtener los pagos");
  }
};

const cargarDatosPago = (usuario) => {
  codigo.value = usuario.codigo;
  // idCliente.value = usuario.idCliente;
  // plan.value = usuario.plan;
  valor.value = usuario.valor;
    currentId.value = usuario._id;

  abrir(2);
};
const editarPagos = async () => {
  const idPagosValue = idPagos.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idPagosSeleccionada = idPagosValue ? idPagosValue.value : null;
  const idclienteValue = idCliente.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idclienteSeleccionada = idclienteValue ? idclienteValue.value : null;
 
    try {
      await usePago.actualizarPago({
        _id: currentId.value,
        codigo: codigo.value,
        plan: idPagosSeleccionada,
        idCliente: idclienteSeleccionada,
        valor: valor.value,
      });
      cerrar();
      listarPagos();
    } catch (error) {
      console.error("Error al editar inventario:", error);
    }
  
};
// Ejecutar la función listarPagos al montar el componente
onMounted(() => {
  listarPagos();
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
  margin-bottom: 20px; /* Añadido para dar espacio */
}

/* Estilos para la cabecera de la tabla */
.custom-table-header .q-table-header {
  background-color: #344860;
  color: white; /* Cambia el color del texto si es necesario */
}

/* Estilos para los botones de opciones */
.q-table-body .q-btn {
  min-width: 32px;
}

.q-table-body .q-btn .q-icon {
  font-size: 18px;
}


.rounded-borders{
  border-radius: 8px;
  width: 150vh;
 
}

/* Ajuste del contenedor de la tabla */
.sss {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family:sans-serif;
}

/* Ajustes para el botón de añadir producto */
.tabla {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 20px; /* Añadido para dar espacio */
}

.q-dialog .q-card {
  max-width: 500px; 
  width: 100%; 
}

.q-card-section {
  padding: 20px; 
}

.q-input,
.q-select {
  margin-bottom: 20px;
}

.ff{
  top: -30px;
}

</style>

