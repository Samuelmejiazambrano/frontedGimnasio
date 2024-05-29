import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUsuarioStore = defineStore("usuario", () => {
  let token = ref( "");
  let usuario =ref({})
  let getUsuario = async () => {
    try {
      let res = await axios.get("http://localhost:4600/api/usuario");
      console.log(res);
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  let getUsuarioActivos = async () => {
    try {
      let res = await axios.get("http://localhost:4600/api/usuario/activos");
      console.log(res);
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  let getUsuarioInactivos = async () => {
    try {
      let res = await axios.get("http://localhost:4600/api/usuario/inactivos");
      console.log(res);
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  let agregarUsuarios = async (usuario) => {
    try {
      console.log(token.value);
      const res = await axios.post("http://localhost:4600/api/usuario", usuario, {
        headers: {
          "x-token": token.value,
        },
      });
      console.log("Usuario agregado:", res.data);
      console.log("hola"+token.value);
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      throw error;
    }
  };

  let UpdateUsuarios = async (usuario) => {
    try {
      const res = await axios.put(`http://localhost:4600/api/usuario/update/${usuario._id}`, usuario,{
        headers: {
          "x-token": token.value,
        },
      });
      console.log("Usuario actualizado:", res.data);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  };

  let desactivarUsuarios = async (usuario) => {
    try {
      const res = await axios.put(`http://localhost:4600/api/usuario/desactivar/${usuario._id}`);
      console.log("Usuario desactivado:", res.data);
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      throw error;
    }
  };

  let activarUsuarios = async (usuario) => {
    try {
      const res = await axios.put(`http://localhost:4600/api/usuario/activar/${usuario._id}`);
      console.log("Usuario activado:", res.data);
    } catch (error) {
      console.error("Error al activar usuario:", error);
      throw error;
    }
  };

  let login = async (email, password) => {
    console.log(email, password);
    try {
      let res = await axios.post("http://localhost:4600/api/usuario/login", {
        email: email,
        password: password,
      });
      token.value = res.data.token;
      usuario.value=res.data.usuario
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  
  };

  let clearSession = async () => {
    usuario.value = null;
    token.value = '';
  };

  return {
    getUsuario,
    agregarUsuarios,
    desactivarUsuarios,
    activarUsuarios,
    UpdateUsuarios,
    login,
    token,usuario,clearSession,getUsuarioActivos,getUsuarioInactivos
  };
},{

persist:true
}

);
