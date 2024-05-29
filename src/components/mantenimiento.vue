<template>
  <div id="sss">
    <h2 class="title">Lista de Mantenimiento</h2>

    <div class="q-pa-md q-gutter-sm">
      <div
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        "
      ></div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #344860; margin-bottom: 20px"
          >
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
    </div>

    <div class="q-pa-md" id="xx">
      <q-btn color="green" class="yy" @click="abrir(1)">Añadir Producto</q-btn>
      <q-table
        title="Mantenimiento"
        title-class=" text-weight-bolder text-h5"
        :rows="rows"
        :columns="columns"
        row-key="codigo"
        class="rounded-borders"
        dense
      >
        <template v-slot:head-top>
          <q-tr>
            <q-th
              v-for="column in columns"
              :key="column.name"
              :props="props"
              style="background-color: orange; color: white; font-weight: bold"
            >
              {{ column.label }}
            </q-th>
          </q-tr>
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
let alert = ref(false);
let maquina = ref([]);
let accion = ref(1);
let usuarios = ref([]);
let codigo = ref("");
let descripcion = ref("");
let idMaquina = ref(null);
let responsable = ref(null);
let currentId = ref(null);
let fecha = ref("");
let precio = ref(0);

function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}
function cerrar() {
  alert.value = false;
}

let useMantenimiento = useMantenimientoStore();

let rows = ref([]);
let columns = ref([
  { name: "fecha", label: "fecha", align: "center", field: "fecha" },
  {
    name: "descripcion",
    label: "descripcion",
    align: "center",
    field: "descripcion",
  },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  { name: "createAt", label: "Creado en", align: "center", field: "createAt" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let listarMantenimientos = async () => {
  let response = await useMantenimiento.getMantenimiento();
  rows.value = response.mantenimientos;
  let responseMaquina = await useMantenimiento.getMaquina();

  maquina.value = responseMaquina.maquinarias;

  let responseUsuario = await useMantenimiento.getUsuario();
  usuarios.value = responseUsuario.usuario;
  console.log(response);
};
const agregarMantenimiento = async () => {
  const idMaquinaValue = idMaquina.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idMaquinaSeleccionada = idMaquinaValue ? idMaquinaValue.value : null;
  const idUsuarioValue = responsable.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idUsuarioSeleccionada = idUsuarioValue ? idUsuarioValue.value : null;
  try {
    await useMantenimiento.agregarMantenimiento({
      descripcion: descripcion.value,
      codigo: codigo.value,
      idMaquina: idMaquinaSeleccionada,
      responsable: idUsuarioSeleccionada,
      fecha: fecha.value,
      precio: precio.value,
    });

    cerrar();
    listarMantenimientos();
  } catch (error) {
    console.error("Error al agregar mantenimiento:", error);
  }
};
function cargarDatosMantenimiento(mantenimiento) {
  currentId.value = mantenimiento._id;
  codigo.value = mantenimiento.codigo;
  descripcion.value = mantenimiento.descripcion;
  idMaquina.value = mantenimiento.idMaquina;
  responsable.value = mantenimiento.responsable;
  fecha.value = mantenimiento.fecha;
  precio.value = mantenimiento.precio;

  abrir();
}
const editarMantenimiento = async () => {
  const idMaquinaValue = idMaquina.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idMaquinaSeleccionada = idMaquinaValue ? idMaquinaValue.value : null;
  const idUsuarioValue = responsable.value; // Suponiendo que idSede.value es el objeto { label, value }
  const idUsuarioSeleccionada = idUsuarioValue ? idUsuarioValue.value : null;
  try {
    await useMantenimiento.actualizarMantenimiento({
      _id: currentId.value,
      descripcion: descripcion.value,
      codigo: codigo.value,
      idMaquina: idMaquinaSeleccionada,
      responsable: idUsuarioSeleccionada,
      fecha: fecha.value,
      precio: precio.value,
    });
    cerrar();
    listarMantenimientos();
  } catch (error) {
    console.error("Error al editar inventario:", error);
  }
};

// const desactivarMantenimiento = async (mantenimiento) => {
//   try {
//     if (mantenimiento && mantenimiento._id) {
//       await useMantenimiento.desactivarMantenimiento(mantenimiento);
//       Notify.create("Plan desactivado correctamente");
//       listarIngesos(); // Actualizar la lista de planes después de desactivar uno
//     } else {
//       Notify.create("Plan no válido");
//     }
//   } catch (error) {
//     console.error("Error al desactivar plan:", error);
//     Notify.create("Error al desactivar plan");
//   }
// };

// const activarMantenimiento = async (mantenimiento) => {
//   try {
//     if (mantenimiento && mantenimiento._id) {
//       await useMantenimiento.activarMantenimiento(mantenimiento);
//       Notify.create("Plan activado correctamente");
//       listarIngesos();
//     } else {
//       Notify.create("Plan no válido");
//     }
//   } catch (error) {
//     console.error("Error al activar plan:", error);
//     Notify.create("Error al activar plan");
//   }
// };
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
}
.yy{
  top: -40px;
}
#xx{
  font-size: 60px;
  font-family: "Roboto", sans-serif;
 width: 100%;
}
</style>
