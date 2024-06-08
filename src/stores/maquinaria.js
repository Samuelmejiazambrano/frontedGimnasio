import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useMaquinaStore = defineStore("Maquinaria", () => {
    let getMaquina = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/maquinas");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let agregarMaquinaria = async (usuario) => {
        try {
            const res = await axios.post("http://localhost:4600/api/maquinas",usuario);
            console.log("Usuario agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error;
          }
    };
    let getSede = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/sede");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let actualizarMaquina = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/maquinas/actualizar/${usuario._id}`,usuario);
            console.log("maquina actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; 
          }
    };
    let desactivarMaquina= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/maquinas/desactivar/${usuario._id}`);
            console.log("Maquina desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let activarMaquina = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/maquinas/activar/${usuario._id}`);
            console.log("Maquina desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let getmaquinasActivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/maquinas/activos");
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      };
      let getmaquinasInactivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/maquinas/inactivos");
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      };
    return {
        getMaquina,agregarMaquinaria,getSede,actualizarMaquina,getmaquinasActivos,getmaquinasInactivos,activarMaquina,desactivarMaquina
    };
});