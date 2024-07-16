<template>
  <div id="jjj">
    <h2 class="title">Lista de Planes</h2>

    <div class="q-pa-md" id="cont">
      <div class="btn">
        <q-select
          class="select"
          v-model="selectedClientId"
          :options="options"
          label="Seleccionar Plan"
        />

        <q-btn
          color="green"
          icon="search"
          class="sam"
          @click="buscarPlan()"
          :disable="loading"
        >
          <q-tooltip>Buscar Plan</q-tooltip>
          <template v-slot:loading>
            <q-spinner size="20px" color="white" />
          </template>
        </q-btn>

        <q-btn color="green" class="sam" @click="abrir(1)" :disable="loading">
          Añadir Plan
          <q-tooltip>Añadir Plan</q-tooltip>
          <template v-slot:loading>
            <q-spinner size="20px" color="white" />
          </template>
        </q-btn>

        <select
          class="select-cont"
          v-model="selectedOption"
          id="selectAccion"
          @change="seleccionarAccion"
          :disabled="loading"
        >
          <option value="listarTodos">Listar Todos los Planes</option>
          <option value="listarActivos">Listar Planes Activos</option>
          <option value="listarInactivos">Listar Planes Inactivos</option>
        </select>
      </div>

      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion === 1 ? "Agregar Plan" : "Editar Plan" }}
            </div>
          </q-card-section>
          <q-input
            outlined
            v-model="CantDias"
            label="Cantidad de Días"
            class="q-my-md q-mx-md"
            type="number"
          />
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
          <q-input
            outlined
            v-model="valor"
            label="Valor"
            class="q-my-md q-mx-md"
            type="number"
          />
          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarPlan() : updatePlanes()"
              color="red"
              class="text-white"
              :disable="loading"
            >
              {{ accion === 1 ? "Agregar" : "Editar" }}
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
              <q-tooltip>{{
                accion === 1 ? "Agregar Plan" : "Editar Plan"
              }}</q-tooltip>
            </q-btn>
            <q-btn
              label="Cerrar"
              color="black"
              outline
              @click="cerrar"
              :disable="loading"
            >
              <q-tooltip>Cerrar</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-table
        class="tabla"
        :rows="rows"
        :columns="columns"
        title="Planes"
        row-key="_id"
        :loading="loading"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
              {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
            </p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <q-btn
              @click="togglePlanStatus(props.row)"
              :loading="props.row.loading"
            >
              <span role="img" aria-label="Toggle">
                {{ props.row.estado === 1 ? "❌" : "✅" }}
              </span>
              <q-tooltip>{{
                props.row.estado === 1 ? "Desactivar Plan" : "Activar Plan"
              }}</q-tooltip>
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn @click="cargarDatosUsuario(props.row)" :disable="loading">
              <span role="img" aria-label="Editar">✏️</span>
              <q-tooltip>Editar Plan</q-tooltip>
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
import { usePlanStore } from "../stores/plan.js";

let usePlan = usePlanStore();
let accion = ref(1);
let rows = ref([]);
let options = ref([]);
let columns = ref([
  { name: "codigo", label: "codigo", align: "center", field: "codigo" },
  {
    name: "valor",
    label: "Valor",
    align: "center",
    field: (row) => formatNumber(row.valor),
  },
  {
    name: "CantDias",
    label: "Cantidad de Días",
    align: "center",
    field: "CantDias",
  },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let loading = ref(false); // Variable para controlar el estado de carga
let selectedOption = ref("listarTodos");

const limpiarCajas = () => {
  CantDias.value = 0;
  descripcion.value = "";
  codigo.value = 0;
  valor.value = 0;
  currentId.value = null;
};

const trimInputValues = () => {
  descripcion.value = descripcion.value.trim();
  codigo.value = codigo.value.toString().trim();
  valor.value = valor.value.toString().trim();
  CantDias.value = CantDias.value.toString().trim();
};
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const seleccionarAccion = async () => {
  loading.value = true;
  try {
    if (selectedOption.value === "listarTodos") {
      await listarIngesos();
    } else if (selectedOption.value === "listarActivos") {
      await listarPLanActivos();
    } else if (selectedOption.value === "listarInactivos") {
      await listarPlanInactivo();
    }
  } catch (error) {
    console.error("Error en seleccionarAccion:", error);
    Notify.create("Error al seleccionar acción");
  } finally {
    loading.value = false; // Desactivar carga después de la operación
  }
};

const listarIngesos = async () => {
  loading.value = true;
  try {
    let r = await usePlan.getPlan();
    rows.value = r.planes;
    options.value = r.planes.map((plan) => ({
      label: `${plan.descripcion} - ${plan.codigo}`,

      value: plan._id,
    }));
    Notify.create({
      message: "Listado de Planes correctamente",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar planes:", error);
    Notify.create("Error al obtener listado de planes");
  } finally {
    loading.value = false;
  }
};

const listarPLanActivos = async () => {
  loading.value = true;
  try {
    const res = await usePlan.getPlanActivos();
    rows.value = res.planes;
    Notify.create({
      message: "Listado de Planes Activos",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar planes activos:", error);
    Notify.create("Error al obtener listado de planes activos");
  } finally {
    loading.value = false;
  }
};

const listarPlanInactivo = async () => {
  loading.value = true;
  try {
    const res = await usePlan.getPlanInactivos();
    rows.value = res.planes;
    Notify.create({
      message: "Listado de Planes Inactivos",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar planes inactivos:", error);
    Notify.create("Error al obtener listado de planes inactivos");
  } finally {
    loading.value = false;
  }
};

let alert = ref(false);
function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
  limpiarCajas();
}

const cargarDatosUsuario = (usuario) => {
  currentId.value = usuario._id;
  descripcion.value = usuario.descripcion;
  codigo.value = usuario.codigo;
  valor.value = usuario.valor;
  CantDias.value = usuario.CantDias;
  abrir(2);
};

const updatePlanes = async () => {
  loading.value = true;
  trimInputValues();
  try {
    await usePlan.UpdatePlan({
      _id: currentId.value,
      descripcion: descripcion.value,
      codigo: codigo.value,
      valor: valor.value,
      CantDias: CantDias.value,
    });
    limpiarCajas();
    cerrar();
    await listarIngesos();
    Notify.create({
      message: "Plan actualizado correctamente",
      color: "green",
    });
  } catch (error) {
    console.error("Error al actualizar el plan:", error);
    Notify.create({
      message: "Error al actualizar el plan",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  listarIngesos();
});

let CantDias = ref(0);
let descripcion = ref("");
let codigo = ref(0);
let valor = ref(0);
let currentId = ref(null);
let selectedClientId = ref(null);

// async function agregarPlan() {
//   loading.value = true;
//   trimInputValues()
//   try {
//     const val = (/\B(?=(\d{3})+(?!\d))/g, ".");
//     if (CantDias.value == "") {
//       Notify.create("Por favor ingrese la cantidad de días");
//     } else if (descripcion.value == "") {
//       Notify.create("Por favor ingrese la descripción");
//     } else if (codigo.value.length <= 3) {
//       Notify.create("Por favor ingrese el código");
//     } else {
//       await usePlan.agregarPlan({
//         descripcion: descripcion.value,
//         codigo: codigo.value,
//         valor: valor.value,
//         CantDias: CantDias.value,
//       });
//       cerrar();
//       await listarIngesos();
//       Notify.create({
//         message: "Plan añadido correctamente",
//         color: "green",
//       });
//     }
//   } catch (error) {
//     console.error("Error al agregar plan:", error);
//     Notify.create({
//       message: "Error al añadir plan",
//       color: "red",
//     });
//   } finally {
//     loading.value = false;
//   }
// }
async function agregarPlan() {
  loading.value = true;
  trimInputValues();
  try {
    const val = (/\B(?=(\d{3})+(?!\d))/g, ".");
    if (CantDias.value <= 0) {
      Notify.create("Por favor ingrese una cantidad de días válida");
    } else if (descripcion.value === "") {
      Notify.create("Por favor ingrese la descripción");
    } else if (codigo.value <= 0) {
      Notify.create("Por favor ingrese un código válido");
    } else if (valor.value <= 0) {
      Notify.create("Por favor ingrese un valor válido");
    } else {
      await usePlan.agregarPlan({
        descripcion: descripcion.value,
        codigo: codigo.value,
        valor: valor.value,
        CantDias: CantDias.value,
      });
      cerrar();
      limpiarCajas();
      await listarIngesos();
      Notify.create({
        message: "Plan añadido correctamente",
        color: "green",
      });
    }
  } catch (error) {
    console.error("Error al agregar plan:", error);
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
    loading.value = false;
  }
}

const desactivarPlan = async (plan) => {
  loading.value = true;
  try {
    if (plan && plan._id) {
      await usePlan.desactivarPlan(plan);
      Notify.create({
        message: "Plan desactivado correctamente",
        color: "green",
      });
      await listarIngesos();
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

const activarPlan = async (plan) => {
  loading.value = true;
  try {
    if (plan && plan._id) {
      await usePlan.activarPlan(plan);
      Notify.create({
        message: "Plan activado correctamente",
        color: "green",
      });
      await listarIngesos();
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al activar plan:", error);
    Notify.create("Error al activar plan");
  } finally {
    loading.value = false;
  }
};

const togglePlanStatus = async (plan) => {
  try {
    loading.value = true;
    if (plan.estado === 1) {
      await desactivarPlan(plan);
    } else {
      await activarPlan(plan);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del plan:", error);
    Notify.create("Error al cambiar el estado del plan");
  } finally {
    loading.value = false;
  }
};

const buscarPlan = async () => {
  try {
    if (selectedClientId.value) {
      loading.value = true;
      const response = await usePlan.getPlanID(selectedClientId.value.value);
      if (response && response.planes) {
        if (Array.isArray(response.planes)) {
          rows.value = response.planes;
        } else {
          rows.value = [response.planes];
        }
        Notify.create({
          message: "Plan encontrado correctamente",
          color: "green",
        });
      } else {
        Notify.create("No se encontraron planes");
      }
    } else {
      Notify.create("Seleccione un Plan");
    }
  } catch (error) {
    console.error("Error al buscar plan por ID:", error);
    Notify.create("Error al buscar plan por ID");
  } finally {
    loading.value = false;
  }
};
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
.tabla {
  margin-bottom: 150px;
  width: 160vh;
  height: 80%;
}
#jjj {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  font-size: 100px;
  width: 100%;
}
.btn {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-bottom: 20px;
}

.btn .q-btn {
  min-width: 40px;
  font-size: 14px;
  border-radius: 20px;
  height: 50px;
  margin-top: 10px;
}

.select-cont {
  width: 20%;
  font-size: 20px;
  height: 40%;
  padding: 6px;
  border-radius: 10px;
  margin-top: 20px;
}
.select {
  width: 20%;
  font-size: 20px;
  height: 40%;
  padding: 6px;
  border-radius: 20px;
}
</style>
