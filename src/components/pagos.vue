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
              planList.map((planes) => ({
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
              <q-tooltip
                >{{ accion === 1 ? "Agregar" : "Editar" }} Pago</q-tooltip
              >
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar">
              <q-tooltip>Cerrar</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="q-pa-md">
      <div class="btn">
        <q-select
          class="select"
          v-model="selectedSedeId"
          :options="options"
          label="Seleccionar Pagos"
        />
        <q-btn color="green" icon="search" @click="buscarPago">
          <q-tooltip>Buscar Pago</q-tooltip>
        </q-btn>

        <q-btn color="green" @click="abrir(1)">
          <q-tooltip>Añadir Producto</q-tooltip>
          Añadir Pagos
        </q-btn>
        <select
          class="select"
          v-model="selectedOption"
          id="selectAccion"
          @change="seleccionarAccion"
        >
          <option value="listarTodos">Listar Todos los Pagos</option>
          <option value="listarActivos">Listar Pagos Activos</option>
          <option value="listarInactivos">Listar Pagos Inactivos</option>
        </select>
      </div>
      <q-table
        title="Pagos"
        title-class="text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders"
        :loading="loading"
        dense
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
          <q-td :props="props" class="q-pr-xs">
            <q-btn @click="togglePlanStatus(props.row)">
              <q-tooltip>{{
                props.row.estado === 1 ? "Desactivar Plan" : "Activar Plan"
              }}</q-tooltip>
              <span role="img" aria-label="Toggle">
                {{ props.row.estado === 1 ? "❌" : "✅" }}
              </span>
            </q-btn>
            <q-btn @click="cargarDatosPago(props.row)">
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
import { usePagoStore } from "../stores/pago.js";
let loading = ref(false);
let alert = ref(false);
let codigo = ref("");
let idPagos = ref("");
let idCliente = ref("");
let valor = ref("");
let accion = ref(1);
let clientes = ref([]);
let plan = ref([]);
let planList = ref("");
let options = ref([]);
let selectedSedeId = ref(null);

let currentId = ref(null);

let usePago = usePagoStore();

let rows = ref([]);
let columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  {
    name: "plan",
    label: "Plan",
    align: "center",
    field: (row) => row.plan.descripcion,
  },
  {
    name: "idCliente",
    label: "Cliente",
    align: "center",
    field: (row) => (row.idCliente ? row.idCliente.nombre : "N/A"),
  },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}

const agregarPagos = async () => {
  const idPagosValue = idPagos.value;
  const idPagosSeleccionada = idPagosValue ? idPagosValue.value : null;
  const idclienteValue = idCliente.value;
  const idclienteSeleccionada = idclienteValue ? idclienteValue.value : null;
  const val = (/\B(?=(\d{3})+(?!\d))/g, ".");
  if (codigo.value.length <= 3) {
    Notify.create("Por favor ingrese un código válido.");
  } else if (!idPagos.value) {
    Notify.create("Por favor seleccione un plan.");
  } else if (!idCliente.value) {
    Notify.create("Por favor seleccione un cliente.");
  } else if (!valor.value) {
    Notify.create("Por favor ingrese un valor válido.");
  } else {
    loading.value = true;
    try {
      await usePago.agregarPago({
        codigo: codigo.value,
        plan: idPagosSeleccionada,
        idCliente: idclienteSeleccionada,
        valor: valor.value,
      });
      cerrar();
      listarPagos();
       Notify.create({
        message: "Pago agregada exitosamente",
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

let listarPagos = async () => {
  loading.value = true;

  try {
    let response = await usePago.getPago();
    rows.value = response.pagos;
    let responseCliente = await usePago.getCliente();
    clientes.value = responseCliente.cliente;

    let responsePlan = await usePago.getPlan();
    planList = responsePlan.planes;

    // Mapear la lista de pagos y asignar el nombre del
    rows.value = rows.value.map((pagos) => {
      let plan = planList.find((plan) => plan._id === pagos.plan);
      return {
        ...pagos,
        nombrePlan: plan ? plan.descripcion : "N/A",
      };
    });
    options.value = response.pagos.map((pago) => ({
      label: pago.codigo,
      value: pago._id,
    }));
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    Notify.create("Error al obtener los pagos");
  } finally {
    loading.value = false;
  }
};

const cargarDatosPago = (usuario) => {
  codigo.value = usuario.codigo;
  idCliente.value = usuario.idCliente ? usuario.idCliente.nombre : "N/A";
  idPagos.value = usuario.plan ? usuario.plan.descripcion : "N/A";
  valor.value = usuario.valor;
  currentId.value = usuario._id;

  abrir(2);
};
const editarPagos = async () => {
  const idPagosValue = idPagos.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idPagosSeleccionada = idPagosValue ? idPagosValue.value : null;
  const idclienteValue = idCliente.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idclienteSeleccionada = idclienteValue ? idclienteValue.value : null;
  loading.value = true;

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
      Notify.create({
        message: "Pago editada exitosamente",
        color: "green",
      });
  } catch (error) {
    console.error("Error al editar inventario:", error);
  } finally {
    loading.value = false;
  }
};
const desactivarPago = async (pago) => {
  loading.value = true;
  try {
    if (pago && pago._id) {
      await usePago.desactivarPago(pago);
        Notify.create({
        message: "Pago desactivado exitosamente",
        color: "green",
      });
      listarPagos(); 
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al desactivar plan:", error);
    Notify.create("Error al desactivar plan");
  } finally {
    loading.value = false;
  }
};

const activarPagos = async (pagos) => {
  loading.value = true;

  try {
    if (pagos && pagos._id) {
      await usePago.activarPago(pagos);
        Notify.create({
        message: "Pago activado exitosamente",
        color: "green",
      });
      listarPagos();
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al activar plan:", error);
    Notify.create("Error al activar plan");
  }
};
const togglePlanStatus = async (pagos) => {
  console.log(pagos);
  try {
    if (pagos.estado === 1) {
      await desactivarPago(pagos);
    } else {
      await activarPagos(pagos);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del plan:", error);
    Notify.create("Error al cambiar el estado del plan");
  } finally {
    loading.value = false;
  }
};
const buscarPago = async () => {
  loading.value = true;

  try {
    if (selectedSedeId.value) {
      const res = await usePago.getPagoID(selectedSedeId.value.value);
      console.log(res);
      console.log("hola");
      if (res && res.pagos) {
        rows.value = [res.pagos];
            Notify.create({
        message: "Pago encontrada exitosamente",
        color: "green",
      });
      } else {
        Notify.create("No se encontró la pagos");
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

const listarPagosActivos = async () => {
  loading.value = true;

  try {
    const res = await usePago.getPagoActivos();
    console.log(res);
    rows.value = res;
         Notify.create({
        message: "Pago activos exitosamente",
        color: "green",
      });
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  } finally {
    loading.value = false;
  }
};
const listarPagosInactivo = async () => {
  loading.value = true;

  try {
    const res = await usePago.getPagoInactivos();
    rows.value = res;
        Notify.create({
        message: "Pago inactivos exitosamente",
        color: "green",
      });
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  } finally {
    loading.value = false;
  }
};
let selectedOption = ref("listarTodos");
const seleccionarAccion = async () => {
  if (selectedOption.value === "listarTodos") {
    await listarPagos();
  } else if (selectedOption.value === "listarActivos") {
    await listarPagosActivos();
  } else if (selectedOption.value === "listarInactivos") {
    await listarPagosInactivo();
  }
};
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

.rounded-borders {
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
  font-family: sans-serif;
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

.ff {
  top: -30px;
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
.select {
  padding: 10px;
}
</style>
