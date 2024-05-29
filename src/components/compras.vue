<template>
  <div id="jjj">
    <h2 class="title">Lista de Planes</h2>

    <div class="q-pa-md" id="cont">
      <div class="btn">
        <q-btn color="green" class="sam" @click="abrir(1)">Añadir Plan</q-btn>
        <q-btn color="primary" class="sa" @click="listarIngesos()"
          >Listar Usuarios
        </q-btn>
        <q-btn color="primary" class="sa" @click="listarPLanActivos()"
          >Listar Usuarios Activos</q-btn
        >
        <q-btn color="primary" class="sa" @click="listarPlanInactivo()"
          >Listar Usuarios Inactivos</q-btn
        >
      </div>

      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Plan" : "Editar Plan" }}
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
              @click="accion === 1 ? agregarUsuario() : updatePlanes()"
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
        class="tabla"
        :rows="rows"
        :columns="columns"
        title="Inventario"
        row-key="_id"
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <p :style="{ color: props.row.estado == 1 ? 'green' : 'red' }">
              {{ props.row.estado == 1 ? "Activo" : "Inactivo" }}
            </p>
            <q-btn @click="togglePlanStatus(props.row)">
              <span role="img" aria-label="Toggle">
                {{ props.row.estado == 1 ? "❌" : "✅" }}
              </span>
            </q-btn>
            <q-btn @click="cargarDatosUsuario(props.row)">
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
import { usePlanStore } from "../stores/plan.js";

let usePlan = usePlanStore();
let accion = ref(1);
let rows = ref([]);
let columns = ref([
  { name: "_id", label: "_id", align: "center", field: "_id" },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
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

  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let r = null;

let listarIngesos = async () => {
  r = await usePlan.getPlan();
  rows.value = r.planes;
  console.log(r);
};
const listarPLanActivos = async () => {
  try {
    const res = await usePlan.getPlanActivos();
    rows.value = res.planes;
    Notify.create("Error al obtener usuarios activos");
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  }
};
const listarPlanInactivo = async () => {
  try {
    const res = await usePlan.getPlanInactivos();
    rows.value = res.planes;
    Notify.create("Error al obtener usuarios activos");
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  }
};
let alert = ref(false);
function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}
const cargarDatosUsuario = (usuario) => {
  currentId.value = usuario._id;
  (descripcion.value = usuario.descripcion), (codigo.value = usuario.codigo);
  (valor.value = usuario.valor), (CantDias.value = usuario.CantDias), abrir(2);
};
const updatePlanes = async () => {
  try {
    await usePlan.UpdatePlan({
      _id: currentId.value,
      descripcion: descripcion.value,
      codigo: codigo.value,
      valor: valor.value,
      CantDias: CantDias.value,
    });

    cerrar();
    listarIngesos();
  } catch (error) {
    console.log("hola");
  }
};

onMounted(() => {
  listarIngesos();
});

let CantDias = ref(0);
let descripcion = ref("");
let codigo = ref(0);
let valor = ref(0); // Valor es requerido, así que inicializamos con un valor por defecto.
let currentId = ref(null);
async function agregarUsuario() {
  try {
    await usePlan.agregarPlan({
      descripcion: descripcion.value,
      codigo: codigo.value,
      valor: valor.value,
      CantDias: CantDias.value,
    });
    cerrar();
    listarIngesos();
  } catch (error) {
    console.error("Error al agregar inventario:", error);
  }
}
const desactivarPlan = async (plan) => {
  try {
    if (plan && plan._id) {
      await usePlan.desactivarPlan(plan);
      Notify.create("Plan desactivado correctamente");
      listarIngesos(); // Actualizar la lista de planes después de desactivar uno
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al desactivar plan:", error);
    Notify.create("Error al desactivar plan");
  }
};

const activarPlan = async (plan) => {
  try {
    if (plan && plan._id) {
      await usePlan.activarPlan(plan);
      Notify.create("Plan activado correctamente");
      listarIngesos();
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al activar plan:", error);
    Notify.create("Error al activar plan");
  }
};

const togglePlanStatus = async (plan) => {
  try {
    if (plan.estado === 1) {
      await desactivarPlan(plan);
    } else {
      await activarPlan(plan);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del plan:", error);
    Notify.create("Error al cambiar el estado del plan");
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
  gap: 10px;
}
/* #cont {
  font-size: 2000px;
} */
</style>
