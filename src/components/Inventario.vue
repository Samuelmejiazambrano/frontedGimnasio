<template>
  <div id="rrr">
    <h2 class="title">Lista de Inventario</h2>
    <div class="q-pa-md">
      <div style="width: 120vh">
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          "
        >
          <q-btn
            color="green"
            class="moi"
            icon="inventory"
            @click="abrirAgregarModal(1)"
          />
        </div>
      </div>

      <!-- Modal para agregar/editar -->
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
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn @click="cargarDatosUsuario(props.row)">
                <span role="img" aria-label="Editar">✏️</span>
              </q-btn>
              <q-btn
                color="red"
                flat
                dense
                round
                icon="delete"
                @click="eliminarInventario(props.row)"
              />
            </div>
          </q-td>
        
        </template>
       
      </q-table>
        <q-tr>
            <q-td colspan="4" class="text-right">
              <div class="text-h6">Total: {{ total.total }}</div>
            </q-td>
          </q-tr>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useInventarioStore } from "../stores/inventario.js";

let useInventario = useInventarioStore();

let rows = ref([]);
let columns = ref([
  { name: "codigo", label: "Código", align: "center", field: "codigo" },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
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

let agregarModal = ref(false);
let descripcion = ref("");
let codigo = ref("");
let valor = ref("");
let cantidad = ref("");
let accion = ref(1);
let currentId = ref(null);
let total = ref(0);
const listarInventario = async () => {
  const response = await useInventario.getInventario();
  total.value = await useInventario.getTotal();
  console.log(total.value);
  rows.value = response.inventarios;
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
    try {
      await useInventario.agregarInvntario({
        descripcion: descripcion.value,
        codigo: codigo.value,
        valor: valor.value,
        cantidad: cantidad.value,
      });
      cerrarAgregarModal();
      listarInventario();
    } catch (error) {
      console.error("Error al agregar inventario:", error);
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
      console.error("Error al editar inventario:", error);
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

#rrr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: "Roboto", sans-serif;
}

.moi {
  top: -30px;
}
</style>
