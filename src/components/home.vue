<template>
  <div class="home">
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

<script>

</script>

<style scoped>
.home {
  background-image: url("https://www.elindependiente.com/wp-content/uploads/2023/07/en-cuanto-tiempo-se-nota-el-gimnasio-1.png");
  background-size: cover;
  background-repeat: no-repeat;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.feature h4, .feature p {
  color: white; /* Color de texto más visible */
}
</style>
