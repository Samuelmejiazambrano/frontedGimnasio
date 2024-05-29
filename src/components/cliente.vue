
<template>
    <div id="sss">
      <h2 class="title">Lista de cliente</h2>
      <div
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          height: 25px;
          
        "
      >
        <q-btn color="green" class="sam" @click="abrir(1)">Añadir Cliente</q-btn> 
      </div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 500px">
          <q-card-section style="background-color: #344860; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Instructor" : "Editar Instructor" }}
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
          <q-input
            outlined
            v-model="foto"
            label="foto"
            class="q-my-md q-mx-md"
            type="text"
          />
          <q-input
            outlined
            v-model="plan"
            label="plan"
            class="q-my-md q-mx-md"
            type="text"
          />
          
         
          <q-card-actions align="right">
            <q-btn
              @click="accion === 1 ? agregarCliente() : editarIngreso()"
              color="red"
              class="text-white"
            >
              {{ accion === 1 ? "Agregar" : "Editar" }}
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar" />
          </q-card-actions>
        </q-card>
      </q-dialog> 
      <div class="q-pa-md" id="tt">
        <q-table
          title="Sedes"
          :rows="rows"
          :columns="columns"
          row-key="name"
          class="custom-table-header"
        >
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn flat dense round  icon="edit"></q-btn>
              <q-btn  class="sam" icon="edit" @click="abrir(1)"></q-btn> 
              <q-btn
                flat
                dense
                round
                icon="delete"
                @click="eliminarUsuario(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from "vue";
  import { useClienteStore } from "../stores/cliente.js";
  
  let useCliente = useClienteStore();
  
  let rows = ref([]);
  let columns = ref([
    { name: "codigo", label: "_id", align: "center", field: "_id" },
    { name: "nombre", label: "nombre", align: "center", field: "nombre" },
    {
      name: "direccion",
      label: "direccion",
      align: "center",
      field: "direccion",
    },
    { name: "fechaNac", label: "fechaNac", align: "center", field: "fechaNac" },
    { name: "createAt", label: "createAt", align: "center", field: "createAt" },
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
  
  let r = null;
  let alert = ref(false);
function abrir(accionModal) {
  accion.value = accionModal;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}
  let listarCliente = async () => {
    r = await useCliente.getCliente();
  
    rows.value = r.cliente;
    console.log(r);
  };

async function agregarCliente() {
  try {
    await useCliente.postCliente({
      cc: cc.value,
      nombre: nombre.value,
      fechaIngreso: fechaIngreso.value,
      fechaNac: fechaNac.value,
      direccion: direccion.value,
      telefono: telefono.value,
      foto: foto.value,
      plan: plan.value
    });
    cerrar();
  } catch (error) {
    console.error("Error al agregar cliente:", error);
  }
}

  onMounted(() => {
  listarCliente();
});
  </script>
  
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
  #sss{
    display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  }
  #tt{
    /* font-family: fantasy; */
    width: 100%;
  }
  </style>
  