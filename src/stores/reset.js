import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useResetStore = defineStore("reset", () => {
  const cargando = ref(false);
  const loading = ref(false);
  let useUsuario = useUsuarioStore();

  const envioCorreo = async (email) => {
    try {
      cargando.value = true;
      const res = await axios.put(`/reset/envio/email`, {email:email });
      console.log(email);
      return res;
    } catch (error) {

      throw error;

    } finally {
      cargando.value = false;
    }
  };
  
  

  const nuevaContrasena = async (nuevaContrasena, token) => {
    try {
      loading.value = true;
      const res = await axios.put(`/reset/nueva/contrasena`, { nuevaContrasena }, { headers: { reset: token } });
      return res;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    envioCorreo,
    nuevaContrasena,
    cargando,
    loading,
  };
});
