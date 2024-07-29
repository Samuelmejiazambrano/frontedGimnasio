<template>
  <div id="sss">
    <h2 class="title">Lista de Mantenimiento</h2>

    <div class="btn">
      <q-select
        class="select"
        v-model="selectedSedeId"
        :options="options"
        label="Seleccionar Mantenimiento"
      />
      <q-btn color="green" icon="search" @click="buscarMantenimiento">
        <q-tooltip>Buscar Mantenimiento</q-tooltip>
      </q-btn>
      <q-btn color="green" @click="abrir(1)">
        <q-tooltip>Añadir Mantenimiento</q-tooltip>
        Añadir Mantenimiento
      </q-btn>
    </div>

    <q-dialog v-model="alert" persistent>
      <q-card class="" style="width: 700px">
        <q-card-section style="background-color: #344860; margin-bottom: 20px">
          <div class="text-h6 text-white">
            {{ accion == 1 ? "Agregar Mantenimiento" : "Editar Mantenimiento" }}
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
          label="Máquina"
          class="q-my-md q-mx-md"
          :options="
            maquina.map((maquinaria) => ({
              label: maquinaria.descripcion,
              value: maquinaria._id,
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
        title-class="text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders"
        :loading="loading"
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
              <q-tooltip>Editar Mantenimiento</q-tooltip>
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

let loading = ref(false);

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
  loading.value = true;
  try {
    const response = await useMantenimiento.getMantenimiento();
    rows.value = response.mantenimientos;
    const responseMaquina = await useMantenimiento.getMaquina();
    maquina.value = responseMaquina.maquinarias;
    const responseUsuario = await useMantenimiento.getUsuario();
    usuarios.value = responseUsuario.usuario;
    console.log(usuarios);
    options.value = response.mantenimientos.map((mantenimiento) => ({
      label: `${mantenimiento.descripcion} - ${mantenimiento.codigo}`,

      value: mantenimiento._id,
    }));
  } catch {
    console.log("error");
  } finally {
    loading.value = false;
  }
};
const trimInputs = () => {
  descripcion.value = descripcion.value.trim();
  codigo.value = codigo.value.trim();
  fecha.value = fecha.value.trim();
  precio.value = precio.value.trim();
};
const agregarMantenimiento = async () => {
  loading.value = true;
  trimInputs();
  const idMaquinaSeleccionada = idMaquina.value ? idMaquina.value.value : null;
  const idUsuarioSeleccionado = responsable.value
    ? responsable.value.value
    : null;

  if (descripcion.value.trim() === "") {
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
      Notify.create({
        message: "Mantenimiento agregado correctamente.",
        color: "green",
      });
      cerrar();
      listarMantenimientos();
    } catch (error) {
      console.error("Error al agregar mantenimiento:", error);
    } finally {
      loading.value = false;
    }
  }
};

const cargarDatosMantenimiento = (mantenimiento) => {
  currentId.value = mantenimiento._id;
  codigo.value = mantenimiento.codigo;
  descripcion.value = mantenimiento.descripcion;
  idMaquina.value = mantenimiento.idMaquina.descripcion;
  responsable.value = mantenimiento.responsable.nombre;
  fecha.value = moment(mantenimiento.fecha).format("YYYY-MM-DD");
  precio.value = mantenimiento.precio;

  abrir(2); // Cambiado para indicar acción de edición
};

const editarMantenimiento = async () => {
  loading.value = true;
  const idMaquinaSeleccionada = idMaquina.value ? idMaquina.value.value : null;
  const idUsuarioSeleccionado = responsable.value
    ? responsable.value.value
    : null;

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
  } finally {
    loading.value = false;
  }
};

const buscarMantenimiento = async () => {
  loading.value = true;

  try {
    if (selectedSedeId.value) {
      const res = await useMantenimiento.getMantenimientoID(
        selectedSedeId.value.value
      );
      console.log(selectedSedeId.value);
      if (res && res.mantenimientos) {
        rows.value = [res.mantenimientos];
        Notify.create({
          message: "Mantenimiento encontrado.",
          color: "green",
        });
      } else {
        Notify.create("No se encontró el mantenimiento.");
      }
    } else {
      Notify.create("Por favor ingrese un ID de sede.");
    }
  } catch (error) {
    console.error("Error al buscar el mantenimiento:", error);
    Notify.create("Error al buscar el mantenimiento.");
  } finally {
    loading.value = false;
  }
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
