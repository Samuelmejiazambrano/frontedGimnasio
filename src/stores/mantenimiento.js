import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useMantenimientoStore = defineStore("Mantenimiento", () => {
    let getMantenimiento = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/mantenimiento");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
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
    let agregarMantenimiento = async (inventario) => {
        try {
            const res = await axios.post("http://localhost:4600/api/mantenimiento",inventario);
            console.log("mantenimiento agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar mantenimiento:", error);
            throw error; 
          }
    };
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
      let actualizarMantenimiento= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/mantenimiento/actualizar/${usuario._id}`,usuario);
            console.log("mantenimiento actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar mantenimiento:", error);
            throw error; 
          }
    };
      
    let desactivarMantenimiento = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/mantenimiento/desactivar/${usuario._id}`);
            console.log("plan desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let activarMantenimiento= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/mantenimiento/activar/${usuario._id}`);
            console.log("Usuario desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        };
    };
    
    return {
        getMantenimiento,getMaquina,agregarMantenimiento,getUsuario,actualizarMantenimiento,activarMantenimiento,desactivarMantenimiento
    };
});