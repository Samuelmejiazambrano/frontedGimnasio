<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import moment from "moment";
import "moment/locale/es";
import { useClienteStore } from "../stores/cliente.js";

let useCliente = useClienteStore();

let rows = ref([]);
let columns = ref([
  { name: "cc", label: "CC", align: "center", field: "cc" },
  { name: "nombre", label: "Nombre", align: "center", field: "nombre" },
  {
    name: "direccion",
    label: "Dirección",
    align: "center",
    field: "direccion",
  },
  { name: "telefono", label: "Teléfono", align: "center", field: "telefono" },
  {
    name: "fechaNac",
    label: "Fecha de Nacimiento",
    align: "center",
    field: "fechaNac",
  },
  {
    name: "fechaIngreso",
    label: "Fecha de Ingreso",
    align: "center",
    field: "fechaIngreso",
  },
  { name: "nombrePlan", label: "Plan", align: "center", field: "nombrePlan" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let accion = ref(1);
let cc = ref("");
let nombre = ref("");
let fechaNac = ref("");
let fechaIngreso = ref("");
let direccion = ref("");
let telefono = ref("");
let foto = ref("");
let plan = ref("");
let peso = ref("");
let imc = ref("");
let brazo = ref("");
let cintura = ref("");
let pie = ref("");
let estatura = ref("");
let total = ref(0);
let plane = ref([]);
let selectedPlan = ref(null);
let seguimientoData = ref({});
let seguimientoDialog = ref(false);
let currentId = ref(null);
let clientes = ref([]);
let selectedClientId = ref(null);
let r = null;
let alert = ref(false);
let seguimientoAlert = ref(false);
let newlyAddedClienteId = ref(null);
let clienteEncontrado = ref(null);
let clienteNoEncontrado = ref(false);

function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

let currentSeguimientoId = ref(null);

function abrirSeguimiento(cliente) {
  currentId.value = cliente._id; // Asegúrate de que cliente tiene la propiedad _id
  seguimientoAlert.value = true;
  console.log(currentId.value);
}

function mostrarSeguimientos(seguimiento, cliente) {
  peso.value = seguimiento.peso;
  imc.value = seguimiento.imc;
  brazo.value = seguimiento.brazo;
  cintura.value = seguimiento.cintura;
  pie.value = seguimiento.pie;
  estatura.value = seguimiento.estatura;

  currentId.value = cliente._id;
  currentSeguimientoId.value = seguimiento._id;

  seguimientoAlert.value = true;
}

function cerrar() {
  alert.value = false;
}
function cargarDatosIngresos(cliente) {
  currentId.value = cliente._id;
  cc.value = cliente.cc;
  nombre.value = cliente.nombre;
  fechaIngreso.value = cliente.fechaIngreso;
  fechaNac.value = cliente.fechaNac;
  direccion.value = cliente.direccion;
  telefono.value = cliente.telefono;
  foto.value = cliente.foto;
  plan.value = cliente.plan;
  abrir(2); // Esto abre el formulario de edición
}

const editarCliente = async () => {
  try {
    await useCliente.actualizarCliente({
      _id: currentId.value,
      cc: cc.value,
      nombre: nombre.value,
      fechaIngreso: fechaIngreso.value,
      fechaNac: fechaNac.value,
      direccion: direccion.value,
      telefono: telefono.value,
      foto: foto.value,
      plan: plan.value,
    });
    cerrar();
    listarCliente();
  } catch (error) {
    console.error("Error al editar cliente:", error);
  }
};
function cerrarSeguimiento() {
  seguimientoAlert.value = false;
  seguimientoDialog.value = false;
  peso.value = "";
  imc.value = "";
  brazo.value = "";
  cintura.value = "";
  pie.value = "";
  estatura.value = "";
}

async function listarCliente() {
  try {
    let response = await useCliente.getCliente();
    rows.value = response.cliente;
    total.value = await useCliente.totalCliente();
    console.log(total.value);
    console.log(response);
    rows.value = rows.value.map((cliente) => {
      let plan = plane.value.find((p) => p._id === cliente.plan);
      return {
        ...cliente,
        nombrePlan: plan ? plan.descripcion : "N/A",
      };
    });

    // Llenar la lista de clientes
    clientes.value = response.cliente;
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}
const buscarCliente = async () => {
  try {
    const response = await useCliente.getClienteID(
      selectedClientId.value.value
    );
    console.log(selectedClientId.value.value);
    if (response.cliente) {
      rows.value = [response.cliente];
      clienteNoEncontrado.value = false;
      Notify.create("Cliente encontrado");
    } else {
      rows.value = [];
      clienteNoEncontrado.value = true;
      Notify.create("Cliente no encontrado");
    }
  } catch (error) {
    console.error("Error al buscar cliente por ID:", error);
    Notify.create("Error al buscar cliente por ID");
  }
};

async function listarClientesPorPlan() {
  if (selectedPlan.value) {
    console.log("Selected Plan ID: ", selectedPlan.value);
    r = await useCliente.getClientesPorPlan(selectedPlan.value.value);
    rows.value = r.map((cliente) => {
      let plan = plane.value.find((p) => p._id === cliente.plan);
      return {
        ...cliente,
        nombrePlan: plan ? plan.descripcion : "N/A",
      };
    });
    console.log(selectedPlan);
  } else {
    console.error("Plan no seleccionado.");
  }
}

async function listarPlanes() {
  try {
    let res = await useCliente.getPlan();
    plane.value = res.planes;
    console.log(res);
  } catch (error) {
    console.error("Error al listar planes:", error);
  }
}

async function agregarCliente() {
  const namePattern = /^[A-Za-z\s]+$/;
  if (!/^\d{8,}$/.test(cc.value)) {
    Notify.create("por favor ingrese la cc");
  } else if (!namePattern.test(nombre.value)) {
    Notify.create("por favor ingrese el nombre ");
  } else if (fechaIngreso.value == "") {
    Notify.create("por favor ingrese la fecha de ingreso");
  } else if (fechaNac.value == "") {
    Notify.create("por favor ingrese la fechaNac");
  } else if (direccion.value == "") {
    Notify.create("por favor ingrese el telefono");
  } else if (telefono.value.length !== 10) {
    Notify.create("por favor ingrese el telefono  ");
  } else if (foto.value == "") {
    console.log(foto.value);
    Notify.create("por favor ingrese la foto ");
  } else if (plan.value == "") {
    Notify.create("por favor ingrese el plan ");
  } else {
    try {
      let response = await useCliente.postCliente({
        cc: cc.value,
        nombre: nombre.value,
        fechaIngreso: fechaIngreso.value,
        fechaNac: fechaNac.value,
        direccion: direccion.value,
        telefono: telefono.value,
        foto: foto.value, // Ensure foto is included here
        plan: plan.value,
      });

      cerrar();
      listarCliente();
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  }
}
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 800; // Tamaño máximo deseado para la imagen (en píxeles)
      let width = image.width;
      let height = image.height;

      // Redimensiona la imagen proporcionalmente si excede el tamaño máximo
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);

      // Convierte la imagen del canvas a base64 y asigna a foto.value
      foto.value = canvas.toDataURL("image/jpeg", 0.7); // Calidad JPEG ajustable (0.7 es 70% de calidad)

      console.log(foto.value); // Verifica en la consola que la URL de la imagen se imprime correctamente
    };
    image.src = reader.result;
  };

  reader.readAsDataURL(file);
};

async function agregarSeguimiento() {
  try {
    let seguimientoData = {
      fechaIngreso: new Date(),
      peso: peso.value,
      imc: imc.value,
      brazo: brazo.value,
      cintura: cintura.value,
      pie: pie.value,
      estatura: estatura.value,
    };

    // Llama a postSeguimiento pasando el ID del cliente
    await useCliente.postSeguimiento(currentId.value, seguimientoData);
    cerrarSeguimiento();
    listarCliente();
  } catch (error) {
    console.error("Error al agregar seguimiento:", error);
  }
}

const desactivarCliente = async (cliente) => {
  try {
    if (cliente && cliente._id) {
      await useCliente.desactivarCliente(cliente);
      Notify.create("Cliente desactivado correctamente");
      listarCliente();
    } else {
      Notify.create("Cliente no válido");
    }
  } catch (error) {
    console.error("Error al desactivar cliente:", error);
    Notify.create("Error al desactivar cliente");
  }
};

const activarCliente = async (cliente) => {
  try {
    if (cliente && cliente._id) {
      await useCliente.activarCliente(cliente);
      Notify.create("Cliente activado correctamente");
      listarCliente();
    } else {
      Notify.create("Cliente no válido");
    }
  } catch (error) {
    console.error("Error al activar Cliente:", error);
    Notify.create("Error al activar Cliente");
  }
};

function listaSeguimiento(params) {
  seguimiento.value = true;
}
const seguimiento = ref(false); // Define seguimiento como una referencia

function mostrarSeguimiento(cliente) {
  console.log("Mostrar seguimiento para el cliente:", cliente);
  seguimientoData.value = cliente;
  console.log(seguimientoData);
  currentId.value = cliente._id;
  seguimientoDialog.value = true; 
}

const togglePlanStatus = async (cliente) => {
  try {
    if (cliente.estado === 1) {
      await desactivarCliente(cliente);
    } else {
      await activarCliente(cliente);
    }
    listarCliente();
  } catch (error) {
    console.error("Error al cambiar el estado del plan:", error);
  }
};
async function actualizarSeguimientos() {
  try {
    let seguimientoData = {
      peso: peso.value,
      imc: imc.value,
      brazo: brazo.value,
      cintura: cintura.value,
      pie: pie.value,
      estatura: estatura.value,
    };

    await useCliente.actualizarSeguimiento(
      currentId.value,
      currentSeguimientoId.value,
      seguimientoData
    );

    Notify.create("Seguimiento actualizado correctamente");

    cerrarSeguimiento();
    listarCliente();
  } catch (error) {
    console.error("Error al actualizar seguimiento:", error);
  }
}
function calcularCategoriaIMC(imc) {
  if (imc < 18.5) {
    return "Bajo";
  } else if (imc >= 18.5 && imc < 24.9) {
    return "Normal";
  } else if (imc >= 25 && imc < 29.9) {
    return "Sobrepeso";
  } else {
    return "Obesidad";
  }
}

function formatEstatura() {
  if (estatura.value) {
    let value = estatura.value.replace(/,/g, "."); // Reemplazar todas las comas por puntos
    value = value.replace(/\./g, ""); // Quitar todos los puntos de miles

    let metros = parseFloat(value) / 100;
    estatura.value = metros.toFixed(2);
  }
}

onMounted(async () => {
  listarCliente();
  listarPlanes();
});
</script>

<template>
  <div id="sss">
    <h2 class="title">Lista de cliente</h2>

    <q-dialog v-model="alert" persistent>
      <q-card class="" style="width: 500px">
        <q-card-section style="background-color: #344860; margin-bottom: 20px">
          <div class="text-h6 text-white">
            {{ accion == 1 ? "Agregar Cliente" : "Editar Cliente" }}
          </div>
        </q-card-section>
        <q-input
          outlined
          v-model="cc"
          label="cc"
          class="q-my-md q-mx-md"
          type="text"
        />
        <q-input
          outlined
          v-model="nombre"
          label="nombre"
          class="q-my-md q-mx-md"
          type="text"
        />
        <q-input
          outlined
          v-model="fechaIngreso"
          label="fechaIngreso"
          class="q-my-md q-mx-md"
          type="date"
        />
        <q-input
          outlined
          v-model="fechaNac"
          label="fechaNac"
          class="q-my-md q-mx-md"
          type="date"
        />
        <q-input
          outlined
          v-model="direccion"
          label="direccion"
          class="q-my-md q-mx-md"
          type="text"
        />
        <q-input
          outlined
          v-model="telefono"
          label="telefono"
          class="q-my-md q-mx-md"
          type="text"
        />
        <input class="input-img" type="file" ref="fileInput" @change="handleFileUpload" />

        <q-input
          outlined
          v-model="plan"
          label="plan"
          class="q-my-md q-mx-md"
          type="text"
        />
        <q-card-actions align="right">
          <q-btn
            @click="accion === 1 ? agregarCliente() : editarCliente()"
            color="red"
            class="text-white"
          >
            {{ accion === 1 ? "Agregar" : "Editar" }}
          </q-btn>
          <q-btn label="Cerrar" color="black" outline @click="cerrar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="search">
      <div class="select">
        <q-select
          v-model="selectedClientId"
          :options="
            clientes.map((cliente) => ({
              label: cliente.nombre,
              value: cliente._id,
            }))
          "
          label="Seleccionar Cliente"
        />
        <q-btn @click="buscarCliente" color="primary" label="Buscar" />
      </div>

      <div class="select">
        <q-select
          v-model="selectedPlan"
          :options="
            plane.map((planes) => ({
              label: planes.descripcion,
              value: planes._id,
            }))
          "
          label="Seleccionar Plan"
        />
        <q-btn @click="listarClientesPorPlan" color="primary" label="Buscar" />
      </div>
      <div class="select">
        <q-btn color="green" class="sam" @click="abrir(1)"
          >Añadir Cliente</q-btn
        >
      </div>
    </div>

    <div class="q-pa-md" id="tt">
      <q-table
        title="Sedes"
        :rows="rows"
        :columns="columns"
        row-key="name"
        class="custom-table-header"
      >
        <template v-slot:body-cell-fechaNac="props">
          <q-td :props="props">
            {{ moment(props.row.fechaNac).format("dddd, D MMMM YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-fechaIngreso="props">
          <q-td :props="props">
            {{ moment(props.row.fechaIngreso).format("dddd, D MMMM YYYY") }}
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="togglePlanStatus(props.row)">
              <q-dialog v-model="seguimientoAlert" persistent>
                <q-card class="" style="width: 500px">
                  <q-card-section
                    style="background-color: #344860; margin-bottom: 20px"
                  >
                    <div class="text-h6 text-white">Seguimiento</div>
                  </q-card-section>
                  <q-input
                    outlined
                    v-model="peso"
                    label="Peso"
                    class="q-my-md q-mx-md"
                    type="number"
                  />

                  <q-input
                    outlined
                    v-model="brazo"
                    label="Brazo"
                    class="q-my-md q-mx-md"
                    type="number"
                  />
                  <q-input
                    outlined
                    v-model="cintura"
                    label="Cintura"
                    class="q-my-md q-mx-md"
                    type="number"
                  />
                  <q-input
                    outlined
                    v-model="pie"
                    label="Pie"
                    class="q-my-md q-mx-md"
                    type="number"
                  />
                  <q-input
                    outlined
                    v-model="estatura"
                    label="Estatura (cm)"
                    class="q-my-md q-mx-md"
                    type="text"
                    @input="formatEstatura"
                  />

                  <q-card-actions align="right">
                    <q-btn
                      @click="
                        currentSeguimientoId
                          ? actualizarSeguimientos()
                          : agregarSeguimiento()
                      "
                      color="red"
                      class="text-white"
                    >
                      {{ currentSeguimientoId ? "Editar" : "Guardar" }}
                    </q-btn>
                    <q-btn color="black" outline @click="cerrarSeguimiento"
                      >Cerrar</q-btn
                    >
                  </q-card-actions>
                </q-card>
              </q-dialog>
              
              
               <q-dialog v-model="seguimientoDialog" class="seguimiento" persistent>
      <q-card class="">
        <q-card-section style="background-color: #344860; margin-bottom: 20px" class="s">
          <div class="text-h5 text-white text-center nombre">Seguimientos del Cliente:{{ seguimientoData.nombre }}</div>
          
          <img v-if="seguimientoData.foto" :src="seguimientoData.foto" alt="Foto de cliente"
            style="max-width: 40%; max-height:120px; object-fit: cover; border-radius: 8px;">
        </q-card-section>

        <q-card-section class="listaSeguimiento">
          <q-card v-for="seguimiento in seguimientoData.seguimiento" :key="seguimiento.fechaIngreso">
            <q-card-section>
              <div>Fecha de ingreso: {{ moment(seguimiento.fechaIngreso).format("dddd, D MMMM YYYY") }}</div>
              <div>Peso: {{ seguimiento.peso }}</div>
              <div>IMC: {{ seguimiento.imc }} ({{ calcularCategoriaIMC(seguimiento.imc) }})</div>
              <div>Brazo: {{ seguimiento.brazo }}</div>
              <div>Cintura: {{ seguimiento.cintura }}</div>
              <div>Pie: {{ seguimiento.pie }}</div>
              <div>Estatura: {{ seguimiento.estatura }}</div>
              <q-btn @click="mostrarSeguimientos(seguimiento, seguimientoData)"
                class="editar">Editar</q-btn>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn color="black" outline @click="cerrarSeguimiento()">Cerrar</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

              <span role="img" aria-label="Toggle">
                {{ props.row.estado == 1 ? "❌" : "✅" }}
              </span>
            </q-btn>
            <q-btn class="sam" @click="abrirSeguimiento(props.row)">
              <q-icon name="add_circle" />
            </q-btn>
            <q-btn @click="mostrarSeguimiento(props.row)">
              <q-icon name="visibility" />
            </q-btn>

            <q-btn @click="cargarDatosIngresos(props.row)">
              <span role="img" aria-label="Editar">✏️</span>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  border-bottom: 3px solid #344860;
  padding-top: 20px;
  font-weight: 900;
}

.custom-table-header .q-table-header {
  background-color: #344860;
  color: white;
}

.rounded-borders .q-table-container .q-table {
  border-radius: 8px;
}

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

#tt {
  width: 100%;
}
.seguimiento {
  max-width: 2000px;
  width: 180vh;
}



.listaSeguimiento {
  display: grid;
  grid-template-columns: repeat( 2,1fr); /* Cambiado para una tarjeta por fila */
  gap: 30px;
  padding: 20px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.listaSeguimiento q-card {
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.listaSeguimiento q-card-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px; /* Ajusta el espaciado interno según sea necesario */
}

/* Estilos para la imagen de la tarjeta */
.listaSeguimiento img {
  max-width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px; /* Ajuste para el margen inferior */
}

.search {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  padding: 30px;
}

.search > * {
  width: 20%;
}
.select > * {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  flex-direction: column;
}
.s{
display: flex;
width: 100%;
}
.s img{
 margin-left: 100px;
 
}
.editar {
  background: #b5bbc2;
}
.nombre{
margin-top: 30px;
width: 300px;
}
.input-img{

 width: 100vh;
 height: 10px;
 padding: 20px;
}
.input-img input{

 padding: 20px;
}
</style>
