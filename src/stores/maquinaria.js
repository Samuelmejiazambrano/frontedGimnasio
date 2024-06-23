import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";

export const useMaquinaStore = defineStore("Maquinaria", () => {
  let useUsuario = useUsuarioStore();
  let loading = ref(false);

  let getMaquina = async () => {
    loading.value = true;
    try {
      let res = await axios.get("/maquinas", {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  let agregarMaquinaria = async (maquina) => {
    loading.value = true;
    try {
      const res = await axios.post("/maquinas", maquina, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      console.log("Maquina agregada:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al agregar maquinaria:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  let getSede = async () => {
    loading.value = true;
    try {
      let res = await axios.get("/sede", {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  let actualizarMaquina = async (maquina) => {
    loading.value = true;
    try {
      const res = await axios.put(`/maquinas/actualizar/${maquina._id}`, maquina, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      console.log("Maquina actualizada:", res.data);
    } catch (error) {
      console.error("Error al actualizar maquinaria:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  let desactivarMaquina = async (maquina) => {
    loading.value = true;
    try {
      const res = await axios.put(`/maquinas/desactivar/${maquina._id}`, "", {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      console.log("Maquina desactivada:", res.data);
    } catch (error) {
      console.error("Error al desactivar maquinaria:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  let activarMaquina = async (maquina) => {
    loading.value = true;
    try {
      const res = await axios.put(`/maquinas/activar/${maquina._id}`, "", {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      console.log("Maquina activada:", res.data);
    } catch (error) {
      console.error("Error al activar maquinaria:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  let getmaquinasActivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get("/maquinas/activos", {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  let getmaquinasInactivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get("/maquinas/inactivos", {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getMaquinariaID = async (sedeId) => {
    loading.value = true;
    try {
      let res = await axios.get(`/maquinas/${sedeId}`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  return {
    agregarMaquinaria,
    getMaquina,
    getSede,
    actualizarMaquina,
    getmaquinasActivos,
    getmaquinasInactivos,
    activarMaquina,
    desactivarMaquina,
    getMaquinariaID,
    loading,
  };
});
