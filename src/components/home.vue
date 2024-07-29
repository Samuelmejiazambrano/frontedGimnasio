<template>
  <div class="home">
    <section class="birthday-section">
      <h4>Cumpleañeros del Mes</h4>
      <ul>
        <li v-for="cliente in clientesCumple" :key="cliente._id">
          {{ cliente.nombre }} - 
          <span class="fecha-cumple">{{ formatFecha(cliente.fechaNac) }}</span>
        </li>
      </ul>
    </section>

    <section class="hero-section">
      <div class="hero-content">
        <h1>Titan Fitness Club</h1>
        <h5>
          ¡Transforma tu cuerpo y tu mente con nuestro enfoque integral en el
          fitness y el bienestar!
        </h5>
      </div>
    </section>

    <section class="features-section">
      <div class="feature">
        <q-icon name="directions_run" size="50px" class="feature-icon" />
        <h4>Variedad de Actividades</h4>
        <p>
          Desde entrenamiento con pesas hasta clases de yoga, ofrecemos una
          amplia gama de actividades para satisfacer tus necesidades de
          acondicionamiento físico.
        </p>
      </div>
      <div class="feature">
        <q-icon name="access_time" size="50px" class="feature-icon" />
        <h4>Horario Flexible</h4>
        <p>
          Nuestro gimnasio está abierto las 24 horas del día, los 7 días de la
          semana, para que puedas hacer ejercicio en cualquier momento que se
          ajuste a tu agenda.
        </p>
      </div>
      <div class="feature">
        <q-icon name="local_hospital" size="50px" class="feature-icon" />
        <h4>Entrenadores Expertos</h4>
        <p>
          Nuestro equipo de entrenadores certificados te guiará en cada paso del
          camino, brindándote el apoyo y la motivación que necesitas para
          alcanzar tus objetivos.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useClienteStore } from "../stores/cliente.js";
import { format } from 'date-fns';

const useCliente = useClienteStore();
const clientesCumple = ref([]);

const obtenerCumpleanos = async () => {
  try {
    const clientes = await useCliente.getCumpleanos();
    clientesCumple.value = clientes;
    console.log(clientesCumple);
  } catch (error) {
    console.error("Error al obtener los cumpleaños:", error);
  }
};

const formatFecha = (fecha) => {
  return format(new Date(fecha), 'dd MMMM yyyy');
};

onMounted(() => {
  obtenerCumpleanos();
});
</script>

<style scoped>
.home {
  background-image: url("https://www.elindependiente.com/wp-content/uploads/2023/07/en-cuanto-tiempo-se-nota-el-gimnasio-1.png");
  background-size: cover;
  background-repeat: no-repeat;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* Add relative positioning */
}

.birthday-section {
  position: absolute; /* Absolute positioning */
  top: 10px; /* Distance from the top */
  left: 20px; /* Distance from the right */
  width: 300px; /* Adjust width as needed */
  background: rgba(117, 143, 176, 0.8);
  padding: 10px;
  border-radius: 10px;
  color: white;
}

.birthday-section h4 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
  text-align: center;
}

.birthday-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.birthday-section li {
  padding: 5px 0;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
}

.fecha-cumple {
  font-size: 0.9em;
  font-weight: bold;
}

.hero-section {
  width: 90%;
  background: rgba(26, 40, 60, 0.8); /* Fondo con opacidad */
  color: white;
  padding: 100px 0;
  text-align: center;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 150px; /* Adjust margin to prevent overlap */
}

.hero-content {
  max-width: 800px;
  margin: auto;
}

.cta-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}

.cta-button:hover {
  background-color: #0056b3;
}

.features-section {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
  gap: 150px;
}

.feature {
  text-align: center;
}

.feature-icon {
  color: #007bff;
  margin-bottom: 20px;
}

.feature h4,
.feature p {
  color: white; /* Color de texto más visible */
}
</style>
