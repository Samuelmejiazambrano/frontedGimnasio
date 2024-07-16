<template>
  <div id="ttt">
    <div class="q-pa-md" id="rr">
      <h2 class="title">Lista de Maquinaria</h2>

      <div class="btn">
        <q-select
          class="select"
          v-model="selectedSedeId"
          :options="options"
          label="Seleccionar Maquinaria"
        />
        <q-btn
          color="green"
          class="qqq"
          icon="search"
          @click="buscarMaquinaria"
        >
          <q-tooltip>Buscar Maquinaria</q-tooltip>
        </q-btn>

        <q-btn color="green" class="añadir-btn" @click="abrir(1)">
          Añadir Maquinaria
          <q-tooltip>Añadir Maquinaria</q-tooltip>
        </q-btn>
        <select
          class="select"
          v-model="selectedOption"
          id="selectAccion"
          @change="seleccionarAccion"
        >
          <option value="listarTodos">Listar Todas las Maquinas</option>
          <option value="listarActivos">Listar Maquinas Activos</option>
          <option value="listarInactivos">Listar Maquinas Inactivos</option>
        </select>
      </div>

      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #344860; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Maquina" : "Editar Maquina" }}
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
             
              <q-tooltip>{{ accion === 1 ? "Agregar Maquina" : "Editar Maquina" }}</q-tooltip>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar">
              <q-tooltip>Cerrar</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div v-if="loadingTable" class="overlay">
        <q-spinner color="primary" size="3em" />
      </div>

      <q-table
        v-else
        title="Maquinaria"
        :rows="rows"
        :columns="columns"
        row-key="_id"
        class="rounded-borders"
         :loading="loading"
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
            <q-th v-for="column in columns" :key="column.name" :props="props" class="custom-table-header">
              {{ column.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-opciones="props">
          <div class="q-pa-md q-gutter-sm"></div>
          <q-btn @click="cargarDatosUsuario(props.row)">
            <span role="img" aria-label="Editar">✏️</span>
            <q-tooltip>Editar Maquina</q-tooltip>
          </q-btn>
          <q-btn @click="togglePlanStatus(props.row)" :loading="loading">
            <span role="img" aria-label="Toggle">
              {{ props.row.estado == 1 ? "❌" : "✅" }}
            </span>
            <template v-slot:loading>
              <q-spinner color="primary" size="1em" />
            </template>
            <q-tooltip>{{ props.row.estado == 1 ? "Desactivar Maquina" : "Activar Maquina" }}</q-tooltip>
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
  { name: "descripcion", label: "Descripción", align: "center", field: "descripcion" },
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  { name: "FechaUmantenimiento", label: "Fecha de Último Mantenimiento", align: "center", field: "FechaUmantenimiento" },
  { name: "idSede", label: "Sede", align: "center",  field: row => row.idSede.ciudad },
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
const options = ref([]);
const selectedSedeId = ref(null);
const currentId = ref(null);
const selectedOption = ref("listarTodos");
const loading = ref(false); // Para el overlay de carga de la tabla

const limpiarCajas = () => {
  descripcion.value = "";
  codigo.value = "";
  idSede.value = "";
  fecha.value = "";
  FechaUmantenimiento.value = "";
};
const seleccionarAccion = async () => {
  if (selectedOption.value === "listarTodos") {
    await listarMaquinas();
  } else if (selectedOption.value === "listarActivos") {
    await listarMaquinariaActivos();
  } else if (selectedOption.value === "listarInactivos") {
    await listarMaquinariaInactivo();
  }
};

const abrir = (accionModal) => {
  accion.value = accionModal;
  alert.value = true;
};

const cerrar = () => {
  alert.value = false;
  limpiarCajas()
};

const listarMaquinas = async () => {

  loading.value = true;
  try{
   let response = await useMaquina.getMaquina();
  let maquinarias = response.maquinarias;
   console.log(response);
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

  options.value = response.maquinarias.map((maquinaria) => ({
    label: `${maquinaria.descripcion} - ${maquinaria.codigo}`,
    value: maquinaria._id,
  }));
  }catch{
  console.log("error");
  }finally{
  loading.value=false
  }
 
  
};

const buscarMaquinaria = async () => {
  loading.value = true;

  try {
    if (selectedSedeId.value) {
      const res = await useMaquina.getMaquinariaID(selectedSedeId.value.value);
      if (res && res.maquinarias) {
        rows.value = [res.maquinarias];
        Notify.create("Maquinaria encontrada");
      } else {
        Notify.create("No se encontró la Maquinaria");
      }
    } else {
      Notify.create("Por favor ingrese un ID de Maquinaria");
    }
  } catch (error) {
    console.error("Error al buscar la sede:", error);
    Notify.create("Error al buscar la sede");
  }finally{
    loading.value = false;

  }

};

onMounted(() => {
  listarMaquinas();
});
const trimMaquinariaFields = () => {
  descripcion.value = descripcion.value.trim();
};
// const agregarMaquina = async () => {
//   loading.value = true;
//   trimMaquinariaFields()
//   if (descripcion.value === "") {
//     Notify.create("Por favor ingrese la descripción");
//   } else if (codigo.value.length <= 3) {
//     Notify.create("Por favor ingrese el código");
//   } else if (idSede.value === "") {
//     Notify.create("Por favor ingrese el ID de la sede");
//   } else if (fecha.value === "") {
//     Notify.create("Por favor ingrese la fecha");
//   } else if (FechaUmantenimiento.value === "") {
//     Notify.create("Por favor ingrese la fecha de último mantenimiento");
//   } else {
//     loading.value = true;
//     try {
//       const idSedeValue = idSede.value;
//       const idSedeSeleccionada = idSedeValue ? idSedeValue.value : null;

//       if (!idSedeSeleccionada) {
//         console.error("Error: No se ha seleccionado una sede.");
//         return;
//       }

//       await useMaquina.agregarMaquinaria({
//         descripcion: descripcion.value,
//         codigo: codigo.value,
//         idSede: idSedeSeleccionada,
//         fecha: fecha.value,
//         FechaUmantenimiento: FechaUmantenimiento.value,
//       });

//       cerrar();
//       listarMaquinas();
//     } catch (error) {
//       console.error("Error al agregar maquinaria:", error);
//     }finally{
//         loading.value = false;

//     }
//   }
// };
const agregarMaquina = async () => {
  loading.value = true;
  trimMaquinariaFields();
  if (descripcion.value === "") {
    Notify.create("Por favor ingrese la descripción");
  } else if (codigo.value.length <= 3) {
    Notify.create("Por favor ingrese el código");
  } else if (idSede.value === "") {
    Notify.create("Por favor ingrese el ID de la sede");
  } else if (fecha.value === "") {
    Notify.create("Por favor ingrese la fecha");
  } else if (FechaUmantenimiento.value === "") {
    Notify.create("Por favor ingrese la fecha de último mantenimiento");
  } else {
    try {
      const idSedeValue = idSede.value;
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
      if (error.response && error.response.data && error.response.data.errors) {
        error.response.data.errors.forEach((err) => {
          Notify.create({
            message: err.msg,
            color: "red",
          });
        });
      } else {
        Notify.create("Error al agregar la maquinaria");
      }
    } finally {
      loading.value = false;
    }
  }
};

const cargarDatosUsuario = (usuario) => {
  currentId.value = usuario._id;
  descripcion.value = usuario.descripcion;
  codigo.value = usuario.codigo;
  idSede.value = usuario.idSede.ciudad;
  fecha.value = formatDate(usuario.fecha);
  FechaUmantenimiento.value = formatDate(usuario.FechaUmantenimiento);

  abrir(2);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().substr(0, 10);
};

const editarMaquina = async () => {
    loading.value = true;
trimMaquinariaFields()
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
    console.error("Error al editar máquina:", error);
  }finally{
      loading.value = false;

  }
};

const desactivarMaquina = async (maquinarias) => {
    loading.value = true;

  try {
    if (maquinarias && maquinarias._id) {
      await useMaquina.desactivarMaquina(maquinarias);
      Notify.create({
        message: "Máquina desactivada correctamente",
        color: "green",
      });
      listarMaquinas();
    } else {
      Notify.create("Máquina no válida");
    }
  } catch (error) {
    console.error("Error al desactivar máquina:", error);
    Notify.create("Error al desactivar máquina");
  }finally{
      loading.value = false;

  }
};

const activarMaquina = async (maquinaria) => {
    loading.value = true;

  try {
    if (maquinaria && maquinaria._id) {
      await useMaquina.activarMaquina(maquinaria);
      Notify.create({
        message: "Máquina activada correctamente",
        color: "green",
      });
      listarMaquinas();
    } else {
      Notify.create("Máquina no válida");
    }
  } catch (error) {
    console.error("Error al activar máquina:", error);
    Notify.create("Error al activar máquina");
  }finally{
      loading.value = false;

  }
};

const listarMaquinariaActivos = async () => {
    loading.value = true;

  try {
    const res = await useMaquina.getmaquinasInactivos();
    rows.value = res.planes;
    Notify.create({
      message: "Máquinas activas",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar máquinas activas:", error);
    Notify.create("Error al obtener máquinas activas");
  }finally{
      loading.value = false;

  }
};

const listarMaquinariaInactivo = async () => {
    loading.value = true;

  try {
    const res = await useMaquina.getmaquinasActivos();
    rows.value = res.planes;
    Notify.create({
      message: "Máquinas inactivas",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar máquinas inactivas:", error);
    Notify.create("Error al obtener máquinas inactivas");
  }finally{
      loading.value = false;

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
    console.error("Error al cambiar el estado de la máquina:", error);
    Notify.create("Error al cambiar el estado de la máquina");
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
.btn > * {
  border-radius: 30px;
}
.select {
  width: 300px;
  padding: 10px;
}

</style>

