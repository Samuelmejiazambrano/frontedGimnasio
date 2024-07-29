<template>
  <div id="rrr">
    <h2 class="title">Lista de Inventario</h2>
    <div class="q-pa-md">
      <div style="width: 100%">
        <div
      
        >
          <div class="btn">
            <q-btn color="green" class="moi" @click="abrirAgregarModal(1)">
              Agregar
            </q-btn>
            <select
              class="select"
              v-model="selectedOption"
              id="selectAccion"
              @change="seleccionarAccion"
            >
              <option value="listarTodos">Listar Inventario</option>
              <option value="listarActivos">Listar Inventario Activos</option>
              <option value="listarInactivos">Listar Inventario Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      <q-dialog v-model="agregarModal" persistent>
        <q-card class="" style="width: 500px; max-height: 1000px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Inventario" : "Editar Inventario" }}
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
            type="text"
          />
          <q-input
            outlined
            v-model="valor"
            label="Valor"
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
          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarInventario() : editarInventario()"
              color="red"
              class="text-white"
              :loading="accion === 1 ? loadingAgregar : loadingEditar"
            >
              {{ accion === 1 ? "Agregar" : "Editar" }}
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              label="Cerrar"
              color="black"
              outline
              @click="cerrarAgregarModal"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-table
        title="Inventario"
        title-class="text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="_id"
        class="tabla"
        :loading="loadingListado"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <p :style="{ color: props.row.estado == 1 ? 'green' : 'red' }">
              {{ props.row.estado == 1 ? "Activo" : "Inactivo" }}
            </p>
          </q-td>
        </template>
        <template v-slot:body-cell-createAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createAt)}}
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn @click="cargarDatosUsuario(props.row)" tooltip="Editar">
                <span role="img" aria-label="Editar">✏️</span>
                <q-tooltip>Editar Plan</q-tooltip>
              </q-btn>
              <q-btn
                @click="togglePlanStatus(props.row)"
                :loading="props.row.loading"
              >
                <q-tooltip>{{
                  props.row.estado == 1 ? "Desactivar Plan" : "Activar Plan"
                }}</q-tooltip>

                <span role="img" aria-label="Toggle">
                  {{ props.row.estado == 1 ? "❌" : "✅" }}
                </span>
                <template v-slot:loading>
                  <q-spinner color="primary" size="1em" />
                </template>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>

      <q-tr>
        <q-td colspan="4" class="text-right">
          <div class="text-h6 total">Total: {{ total.total }}</div>
        </q-td>
      </q-tr>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useInventarioStore } from "../stores/inventario.js";
import XDate from 'xdate';

const formatDate = (dateString) => {
  const date = new XDate(dateString);
  const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const diaSemana = diasSemana[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const año = date.getFullYear();
  return `${diaSemana}, ${dia} de ${mes} ${año}`;
};

let useInventario = useInventarioStore();

let rows = ref([]);
let columns = ref([
  { name: "codigo", label: "Producto", align: "center", field: "codigo" },
  {
    name: "valor",
    label: "Valor",
    align: "center",
    field: (row) => formatNumber(row.valor),
  },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  {
    name: "estado",
    label: "estado",
    align: "center",
    field: "estado",
  },
  { name: "createAt", label: "Creado en", align: "center", field: "createAt" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let agregarModal = ref(false);
let descripcion = ref("");
let codigo = ref("");
let valor = ref("");
let cantidad = ref("");
let accion = ref(1);
let currentId = ref(null);
let total = ref(0);
let loadingListado = ref(false);
let loadingAgregar = ref(false);
let loadingEditar = ref(false);
let loadingActivar = ref(false);
let selectedOption = ref("listarTodos");
const seleccionarAccion = async () => {
  if (selectedOption.value === "listarTodos") {
    await listarInventario();
  } else if (selectedOption.value === "listarActivos") {
    await listarInventarioActivos();
  } else if (selectedOption.value === "listarInactivos") {
    await listarInventarioInactivo();
  }
};
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const listarInventario = async () => {
  loadingListado.value = true;
  try {
    const response = await useInventario.getInventario();
    total.value = await useInventario.getTotal();
    console.log(total.value);

    rows.value = response.inventarios;
    Notify.create({
      message: "Listado del Inventario",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar inventario:", error);
  } finally {
    loadingListado.value = false;
  }
};
const listarInventarioActivos = async () => {
  loadingListado.value = true;
  try {
    const res = await useInventario.getInventarioActivos();
    rows.value = res.sedes;
    Notify.create({
      message: "inventarios Activos",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar sedes activas:", error);
    Notify.create("Error al obtener sedes activas");
  } finally {
    loadingListado.value = false;
  }
};

const listarInventarioInactivo = async () => {
  loadingListado.value = true;
  try {
    const res = await useInventario.getInventarioInactivos();
    rows.value = res.sedes;
    Notify.create({
      message: "inventarios Inactivas",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar sedes inactivas:", error);
    Notify.create("Error al obtener sedes inactivas");
  } finally {
    loadingListado.value = false;
  }
};

const agregarInventario = async () => {
  if (descripcion.value === "") {
    Notify.create("Por Favor Ingrese la Descripcion");
  } else if (codigo.value === "") {
    Notify.create("Por favor ingrese el codigo");
  } else if (valor.value === "") {
    Notify.create("Por favor ingrese el valor");
  } else if (cantidad.value === "") {
    Notify.create("Por favor ingrese la cantidad");
  } else {
    loadingAgregar.value = true;
    try {
      await useInventario.agregarInvntario({
        descripcion: descripcion.value,
        codigo: codigo.value,
        valor: valor.value,
        cantidad: cantidad.value,
      });
      Notify.create({
        message: "Inventario Agregado Exitosamente",
        color: "green",
      });
      cerrarAgregarModal();
      listarInventario();
    } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      Notify.create({
        message: error.response.data.errors[0].msg,
        color: "red",
      });
    } else {
      Notify.create({
        message: "Error al añadir plan",
        color: "red",
      });
    }
    } finally {
      loadingAgregar.value = false;
    }
  }
};

const editarInventario = async () => {
  if (descripcion.value === "") {
    Notify.create("Por Favor Ingrese la Descripcion");
  } else if (codigo.value === "") {
    Notify.create("Por favor ingrese el codigo");
  } else if (valor.value === "") {
    Notify.create("Por favor ingrese el valor");
  } else if (cantidad.value === "") {
    Notify.create("Por favor ingrese la cantidad");
  } else {
    loadingEditar.value = true;
    try {
      await useInventario.actualizarInvntario({
        _id: currentId.value,
        descripcion: descripcion.value,
        codigo: codigo.value,
        valor: valor.value,
        cantidad: cantidad.value,
      });
      cerrarAgregarModal();
      listarInventario();
    } catch (error) {
     if (error.response && error.response.data && error.response.data.errors) {
      Notify.create({
        message: error.response.data.errors[0].msg,
        color: "red",
      });
    } else {
      Notify.create({
        message: "Error al añadir plan",
        color: "red",
      });
    }
    } finally {
      loadingEditar.value = false;
    }
  }
};

const eliminarInventario = async (row) => {
  try {
    await useInventario.EliminarInventario(row._id);
    listarInventario();
  } catch (error) {
    console.error("Error al eliminar inventario:", error);
  }
};

function abrirAgregarModal(accionModal) {
  accion.value = accionModal;
  agregarModal.value = true;
}

function cerrarAgregarModal() {
  agregarModal.value = false;
  limpiarFormulario();
}

function cargarDatosUsuario(usuario) {
  descripcion.value = usuario.descripcion;
  codigo.value = usuario.codigo;
  valor.value = usuario.valor;
  cantidad.value = usuario.cantidad;
  currentId.value = usuario._id;

  abrirAgregarModal(2);
}

function limpiarFormulario() {
  descripcion.value = "";
  codigo.value = "";
  valor.value = "";
  cantidad.value = "";
  currentId.value = null;
}

const desactivarInventario = async (maquinarias) => {
  maquinarias.loading = true;
  try {
    if (maquinarias && maquinarias._id) {
      await useInventario.desactivarInventario(maquinarias);
      Notify.create({
        message: "Inventario desactivado correctamente",
        color: "green",
      });
      listarInventario();
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al desactivar plan:", error);
    Notify.create("Error al desactivar plan");
  } finally {
    maquinarias.loading = false;
  }
};

const activarInventario = async (maquinaria) => {
  maquinaria.loading = true;
  try {
    if (maquinaria && maquinaria._id) {
      await useInventario.activarInventario(maquinaria);
      Notify.create({
        message: "Inventario activado correctamente",
        color: "green",
      });
      listarInventario();
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al activar plan:", error);
    Notify.create("Error al activar plan");
  } finally {
    maquinaria.loading = false;
  }
};

const togglePlanStatus = async (maquinarias) => {
  try {
    if (maquinarias.estado === 1) {
      await desactivarInventario(maquinarias);
    } else {
      await activarInventario(maquinarias);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del plan:", error);
    Notify.create("Error al cambiar el estado del plan");
  }
};

onMounted(() => {

  listarInventario();
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
.btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 15px;
  margin-bottom: 10px;
  
}
.btn > * {
  border-radius: 30px;
}
.select {
  width: 250px;
  padding: 8px;
}
#rrr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: "Roboto", sans-serif;
}

.moi {
  margin-top: -30px; /* Ajusta el margen superior del botón */
}
.tabla {
  width: 150vh;
}
.total {
  font-size: 1.5rem;
  margin-top: 20px;
  text-align: right;
  width: 100%;
}
</style>
