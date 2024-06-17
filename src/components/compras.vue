<template>
  <div id="jjj">
    <h2 class="title">Lista de Planes</h2>

    <div class="q-pa-md" id="cont">
     <div class="btn">
         
        <q-select
          class="select"
          v-model="selectedClientId"
          :options="options"
          label="Seleccionar Cliente"
        />
        <q-btn color="green" class="sam" @click="buscarPlan()">Buscar Plan</q-btn>
        <q-btn color="green" class="sam" @click="abrir(1)">Añadir Plan</q-btn>
         <select class="select-cont"  v-model="selectedOption" id="selectAccion" @change="seleccionarAccion">
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
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <p :style="{ color: props.row.estado == 1 ? 'green' : 'red' }">
              {{ props.row.estado == 1 ? "Activo" : "Inactivo" }}
            </p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
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
let options = ref([]); // Declaramos una referencia para las opciones del select
let columns = ref([
  { name: "codigo", label: "codigo", align: "center", field: "codigo" },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
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

let selectedOption = ref("listarTodos");
const seleccionarAccion = async () => {
  if (selectedOption.value === "listarTodos") {
    await listarIngesos();
  } else if (selectedOption.value === "listarActivos") {
    await listarPLanActivos();
  } else if (selectedOption.value === "listarInactivos") {
    await listarPlanInactivo();
  }
};
let listarIngesos = async () => {
  let r = await usePlan.getPlan();
  rows.value = r.planes;
  options.value = r.planes.map((plan) => ({
    label: plan.descripcion,
    value: plan._id,
  }));
  console.log(r);
};

const listarPLanActivos = async () => {
  try {
    const res = await usePlan.getPlanActivos();
    rows.value = res.planes;
  } catch (error) {
    console.error("Error al listar planes activos:", error);
    Notify.create("Error al obtener planes activos");
  }
};

const listarPlanInactivo = async () => {
  try {
    const res = await usePlan.getPlanInactivos();
    rows.value = res.planes;
  } catch (error) {
    console.error("Error al listar planes inactivos:", error);
    Notify.create("Error al obtener planes inactivos");
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
  descripcion.value = usuario.descripcion;
  codigo.value = usuario.codigo;
  valor.value = usuario.valor;
  CantDias.value = usuario.CantDias;
  abrir(2);
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
    console.error("Error al actualizar el plan:", error);
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

async function agregarUsuario() {
  const val = (/\B(?=(\d{3})+(?!\d))/g, ".");
  if (CantDias.value == "") {
    Notify.create("por favor ingrese la cantidad de dias ");
  } else if (descripcion.value == "") {
    Notify.create("por favor ingrese la descripcion");
  } else if (codigo.value.length <= 3) {
    Notify.create("por favor ingrese el codigo");
 }else {
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
      console.error("Error al agregar plan:", error);
    }
  }
}

const desactivarPlan = async (plan) => {
  try {
    if (plan && plan._id) {
      await usePlan.desactivarPlan(plan);
      Notify.create("Plan desactivado correctamente");
      listarIngesos();
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

const buscarPlan = async () => {
  try {
    if (selectedClientId.value) {
      const response = await usePlan.getPlanID(selectedClientId.value.value);
      if (response && response.planes) {
        if (Array.isArray(response.planes)) {
          rows.value = response.planes;
        } else {
          rows.value = [response.planes];
        }
        console.log(response.planes);
      } else {
        Notify.create("No se encontraron planes");
      }
    } else {
      Notify.create("Seleccione un Plan");
    }
  } catch (error) {
    console.error("Error al buscar plan por ID:", error);
    Notify.create("Error al buscar plan por ID");
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
