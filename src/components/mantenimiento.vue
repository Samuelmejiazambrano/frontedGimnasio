<template>
  <div id="sss">
    <h2 class="title">Lista de Mantenimiento</h2>

    <div class="btn">
      <q-select
        class="select"
        v-model="selectedSedeId"
        :options="options"
        label="Seleccionar Ingreso"
      />
      <q-btn color="green" icon="search" @click="buscarMantenimiento">
        Buscar Ingreso
      </q-btn>
      <q-btn color="green" @click="abrir(1)">Añadir Producto</q-btn>
    </div>

    <q-dialog v-model="alert" persistent>
      <q-card class="" style="width: 700px">
        <q-card-section style="background-color: #344860; margin-bottom: 20px">
          <div class="text-h6 text-white">
            {{ accion == 1 ? "Agregar Producto" : "Editar Producto" }}
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
          v-model="descripcion"
          label="Descripción"
          class="q-my-md q-mx-md"
          type="text"
        />
        <q-select
          outlined
          v-model="idMaquina"
          label="Maquina"
          class="q-my-md q-mx-md"
          :options="
            maquina.map((maquinarias) => ({
              label: maquinarias.descripcion,
              value: maquinarias._id,
            }))
          "
        />
        <q-input
          outlined
          v-model="fecha"
          label="Fecha"
          class="q-my-md q-mx-md"
          type="date"
        />
        <q-select
          outlined
          v-model="responsable"
          label="Responsable"
          class="q-my-md q-mx-md"
          :options="
            usuarios.map((usuario) => ({
              label: usuario.nombre,
              value: usuario._id,
            }))
          "
        />
        <q-input
          outlined
          v-model="precio"
          label="Precio"
          class="q-my-md q-mx-md"
          type="number"
        />
        <q-card-actions align="right">
          <q-btn
            @click="
              accion === 1 ? agregarMantenimiento() : editarMantenimiento()
            "
            color="red"
            class="text-white"
          >
            {{ accion === 1 ? "Agregar" : "Editar" }}
          </q-btn>
          <q-btn label="Cerrar" color="black" outline @click="cerrar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="q-pa-md" id="xx">
      <q-table
        title="Mantenimiento"
        title-class=" text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders"
        dense
      >
        <template v-slot:body-cell-createAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createAt) }}
          </q-td>
        </template>
           <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            {{ formatDate(props.row.fecha) }}
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm"></div>
            <q-btn @click="cargarDatosMantenimiento(props.row)">
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
import { useMantenimientoStore } from "../stores/mantenimiento.js";
import { Notify } from "quasar";
import moment from "moment";
import "moment/locale/es";

const alert = ref(false);
const maquina = ref([]);
const accion = ref(1);
const usuarios = ref([]);
const codigo = ref("");
const descripcion = ref("");
const idMaquina = ref(null);
const responsable = ref(null);
const currentId = ref(null);
const fecha = ref("");
const precio = ref(0);
const selectedSedeId = ref(null);
const options = ref([]);

function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}
function cerrar() {
  alert.value = false;
}

const useMantenimiento = useMantenimientoStore();

const rows = ref([]);
const columns = ref([
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  { name: "precio", label: "Precio", align: "center", field: "precio" },
  { name: "createAt", label: "Creado en", align: "center", field: "createAt" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const listarMantenimientos = async () => {
  const response = await useMantenimiento.getMantenimiento();
  rows.value = response.mantenimientos;
  const responseMaquina = await useMantenimiento.getMaquina();
  maquina.value = responseMaquina.maquinarias;
  const responseUsuario = await useMantenimiento.getUsuario();
  usuarios.value = responseUsuario.usuario;

  options.value = response.mantenimientos.map((mantenimiento) => ({
    label: mantenimiento.descripcion,
    value: mantenimiento._id,
  }));
};

const agregarMantenimiento = async () => {
  const idMaquinaSeleccionada = idMaquina.value ? idMaquina.value.value : null;
  const idUsuarioSeleccionado = responsable.value ? responsable.value.value : null;

  if (descripcion.value === "") {
    Notify.create("Por favor ingrese la descripción.");
  } else if (codigo.value.length <= 3) {
    Notify.create("Por favor ingrese el código.");
  } else if (!idMaquina.value) {
    Notify.create("Por favor seleccione la maquinaria.");
  } else if (!responsable.value) {
    Notify.create("Por favor seleccione el responsable.");
  } else if (fecha.value === "") {
    Notify.create("Por favor ingrese la fecha.");
  } else if (precio.value <= 0) {
    Notify.create("Por favor ingrese el precio.");
  } else {
    try {
      await useMantenimiento.agregarMantenimiento({
        descripcion: descripcion.value,
        codigo: codigo.value,
        idMaquina: idMaquinaSeleccionada,
        responsable: idUsuarioSeleccionado,
        fecha: fecha.value,
        precio: precio.value,
      });

      cerrar();
      listarMantenimientos();
    } catch (error) {
      console.error("Error al agregar mantenimiento:", error);
    }
  }
};

const cargarDatosMantenimiento = (mantenimiento) => {
  currentId.value = mantenimiento._id;
  codigo.value = mantenimiento.codigo;
  descripcion.value = mantenimiento.descripcion;
  idMaquina.value = mantenimiento.idMaquina;
  responsable.value = mantenimiento.responsable;
  fecha.value = mantenimiento.fecha;
  precio.value = mantenimiento.precio;

  abrir();
};

const editarMantenimiento = async () => {
  const idMaquinaSeleccionada = idMaquina.value ? idMaquina.value.value : null;
  const idUsuarioSeleccionado = responsable.value ? responsable.value.value : null;

  try {
    await useMantenimiento.actualizarMantenimiento({
      _id: currentId.value,
      descripcion: descripcion.value,
      codigo: codigo.value,
      idMaquina: idMaquinaSeleccionada,
      responsable: idUsuarioSeleccionado,
      fecha: fecha.value,
      precio: precio.value,
    });

    cerrar();
    listarMantenimientos();
  } catch (error) {
    console.error("Error al editar mantenimiento:", error);
  }
};

const buscarMantenimiento = async () => {
  try {
    if (selectedSedeId.value) {
      const res = await useMantenimiento.getMantenimientoID(selectedSedeId.value);
      if (res && res.mantenimientos) {
        rows.value = [res.mantenimientos];
        Notify.create("Mantenimiento encontrado.");
      } else {
        Notify.create("No se encontró el mantenimiento.");
      }
    } else {
      Notify.create("Por favor ingrese un ID de sede.");
    }
  } catch (error) {
    console.error("Error al buscar el mantenimiento:", error);
    Notify.create("Error al buscar el mantenimiento.");
  }
};

const formatDate = (date) => {
  return moment(date).format("dddd, D MMMM YYYY");
};

onMounted(() => {
  listarMantenimientos();
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
  color: white; /* Cambia el color del texto si es necesario */
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
  width: 100%;
}
.yy {
  top: -40px;
}
#xx {
  font-size: 60px;
  font-family: "Roboto", sans-serif;
  width: 100%;
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
