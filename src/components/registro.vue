<template>
  <div class="q-pa-md" id="register">

    <div class="q-gutter-y-md column" style="width: 600px; padding: 30px; border-radius: 10px; background-color: #f3f3f3; box-shadow: 2px 10px 10px rgba(0, 0, 0, 0.1);">
      <h3 class="titulo">Registrar</h3>
      <div class="q-gutter-x-sm row">
        <div class="col">
          <q-input class="input" v-model="sede" label="Sede" dense outlined />
          <q-input class="input" v-model="nombre" label="Nombre" dense outlined />
          <q-input class="input" v-model="email" label="Email" dense outlined />
        </div>
        <div class="col">
          <q-input class="input" v-model="direccion" label="Dirección" dense outlined />
          <q-input class="input" v-model="telefono" label="Teléfono" type="number" dense outlined />
          <q-input class="input" v-model="rol" label="Rol" dense outlined />
          <q-input class="input" v-model="password" label="Contraseña" type="password" dense outlined />
        </div>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 20px;">
        <q-btn style="width: 60%;" @click="register" color="primary" label="Registrarse" dense />
      </div>
      <p style="margin-top: 20px; text-align: center;">¿Ya tienes cuenta? <a href="#">Inicia sesión</a></p>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
#register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.input {
  width: 100%;
  margin-bottom: 20px;
}
.titulo{
   height: 0px;
     display: flex;
  justify-content: center;
  align-items: center;
    font-size: 2.1rem;
  font-family: "Roboto", sans-serif;
  font-weight: 900;
}
</style>
