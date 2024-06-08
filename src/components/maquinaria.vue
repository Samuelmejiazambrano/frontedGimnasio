<template>
  <div id="ttt">
    <div class="q-pa-md" id="rr">
        <h2 class="title">Lista de Maquinaria</h2>

      <div class="btn">
        <q-btn color="primary" class="sa" @click="listarMaquinariaActivos()">
          Listar Maquinaria Activos
        </q-btn>
        <q-btn color="primary" class="sa" @click="listarMaquinariaInactivo()">
          Listar Maquinaria Inactivos
        </q-btn>
        <q-btn color="green" class="añadir-btn" @click="abrir(1)">
          Añadir Producto
        </q-btn>
      </div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #344860; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Instructor" : "Editar Instructor" }}
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
            type="number"
          />
          <q-select
            outlined
            v-model="idSede"
            label="Sede"
            class="q-my-md q-mx-md"
            :options="sedes.map((sede) => ({ label: sede.nombre, value: sede._id }))"
          />
          <q-input
            outlined
            v-model="fecha"
            label="Fecha"
            class="q-my-md q-mx-md"
            type="date"
          />
          <q-input
            outlined
            v-model="FechaUmantenimiento"
            label="Fecha de Último Mantenimiento"
            class="q-my-md q-mx-md"
            type="date"
          />
          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarMaquina() : editarMaquina()"
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
        title="Maquinaria"
        :rows="rows"
        :columns="columns"
        row-key="_id"
        class="rounded-borders"
        dense
        style="width: 90%"
      >
        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            {{ moment(props.row.fecha).format("dddd, D MMMM YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-FechaUmantenimiento="props">
          <q-td :props="props">
            {{ moment(props.row.FechaUmantenimiento).format("dddd, D MMMM YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <p :style="{ color: props.row.estado == 1 ? 'green' : 'red' }">
              {{ props.row.estado == 1 ? "Activo" : "Inactivo" }}
            </p>
          </q-td>
        </template>
        <template v-slot:head-top>
          <q-tr>
            <q-th
              v-for="column in columns"
              :key="column.name"
              :props="props"
              class="custom-table-header"
            >
              {{ column.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-opciones="props">
          <div class="q-pa-md q-gutter-sm"></div>
          <q-btn @click="cargarDatosUsuario(props.row)">
            <span role="img" aria-label="Editar">✏️</span>
          </q-btn>
          <q-btn @click="togglePlanStatus(props.row)">
            <span role="img" aria-label="Toggle">
              {{ props.row.estado == 1 ? "❌" : "✅" }}
            </span>
          </q-btn>
          <q-td :props="props" class="q-pr-xs"></q-td>
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
import { useMaquinaStore } from "../stores/maquinaria.js";

const useMaquina = useMaquinaStore();
const alert = ref(false);
const rows = ref([]);
const columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  {
    name: "FechaUmantenimiento",
    label: "Fecha de Último Mantenimiento",
    align: "center",
    field: "FechaUmantenimiento",
  },
  { name: "nombreSede", label: "Sede", align: "center", field: "nombreSede" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);
const descripcion = ref("");
const codigo = ref("");
const idSede = ref("");
const fecha = ref("");
const FechaUmantenimiento = ref("");
const accion = ref(1);
const sedes = ref([]);
const currentId = ref(null);

const abrir = (accionModal) => {
  accion.value = accionModal;
  alert.value = true;
};

const cerrar = () => {
  alert.value = false;
};

const listarMaquinas = async () => {
  let response = await useMaquina.getMaquina();
  let maquinarias = response.maquinarias;

  let responseSedes = await useMaquina.getSede();
  let sedesList = responseSedes.sedes;
  sedes.value = sedesList;

  rows.value = maquinarias.map((maquinaria) => {
    let sede = sedesList.find((s) => s._id === maquinaria.idSede);
    return {
      ...maquinaria,
      nombreSede: sede ? sede.nombre : "N/A",
    };
  });
};

onMounted(() => {
  listarMaquinas();
});

const agregarMaquina = async () => {
  try {
    const idSedeValue = idSede.value; // Suponiendo que idSede.value es el objeto { label, value }
    const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;

    if (!idSedeSeleccionada) {
      console.error("Error: No se ha seleccionado una sede.");
      return;
    }

    await useMaquina.agregarMaquinaria({
      descripcion: descripcion.value,
      codigo: codigo.value,
      idSede: idSedeSeleccionada,
      fecha: fecha.value,
      FechaUmantenimiento: FechaUmantenimiento.value,
    });

    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al agregar maquinaria:", error);
  }
};

const cargarDatosUsuario = (usuario) => {
  currentId.value = usuario._id;
  descripcion.value = usuario.descripcion;
  codigo.value = usuario.codigo;
  idSede.value = usuario.idSede;
  fecha.value = formatDate(usuario.fecha);
  FechaUmantenimiento.value = formatDate(usuario.FechaUmantenimiento);

  abrir(2);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().substr(0, 10);
};

const editarMaquina = async (row) => {
  const idSedeValue = idSede.value;
  const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;
  try {
    await useMaquina.actualizarMaquina({
      _id: currentId.value,
      descripcion: descripcion.value,
      codigo: codigo.value,
      idSede: idSedeSeleccionada,
      fecha: fecha.value,
      FechaUmantenimiento: FechaUmantenimiento.value,
    });
    cerrar();
    listarMaquinas();
  } catch (error) {
    console.error("Error al editar maquina:", error);
  }
};

const desactivarMaquina = async (maquinarias) => {
  try {
    if (maquinarias && maquinarias._id) {
      await useMaquina.desactivarMaquina(maquinarias);
      Notify.create("Plan desactivado correctamente");
      listarMaquinas(); // Actualizar la lista de planes después de desactivar uno
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al desactivar plan:", error);
    Notify.create("Error al desactivar plan");
  }
};

const activarMaquina = async (maquinaria) => {
  try {
    if (maquinaria && maquinaria._id) {
      await useMaquina.activarMaquina(maquinaria);
      Notify.create("Plan activado correctamente");
      listarMaquinas();
    } else {
      Notify.create("Plan no válido");
    }
  } catch (error) {
    console.error("Error al activar plan:", error);
    Notify.create("Error al activar plan");
  }
};

const listarMaquinariaActivos = async () => {
  try {
    const res = await useMaquina.getmaquinasInactivos();
    rows.value = res.planes;
    Notify.create("Error al obtener usuarios activos");
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  }
};

const listarMaquinariaInactivo = async () => {
  try {
    const res = await useMaquina.getmaquinasActivos();
    rows.value = res.planes;
    Notify.create("Error al obtener usuarios activos");
  } catch (error) {
    console.error("Error al listar usuarios activos:", error);
    Notify.create("Error al obtener usuarios activos");
  }
};

const togglePlanStatus = async (maquinarias) => {
  console.log(maquinarias);
  try {
    if (maquinarias.estado === 1) {
      await desactivarMaquina(maquinarias);
    } else {
      await activarMaquina(maquinarias);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del plan:", error);
    Notify.create("Error al cambiar el estado del plan");
  }
};

onMounted(() => {
  listarMaquinas();
});
</script>
<style scoped>
.title {
  font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  border-bottom: 3px solid #344860;
  padding-top: 20px;
}

.rounded-borders .q-table-container .q-table {
  border-radius: 12px;
  width: 100%;
  margin: auto;
}

#rr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: "Roboto", sans-serif;
}

.q-page-container {
  width: 90%;
}

.btn {
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 10px !important;
  width: 90%;
  margin-top: 20px;
}
</style>
