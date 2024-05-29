import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useSedeStore = defineStore("sede", () => {
    let useUsuario = useUsuarioStore();

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
    let getSedeActivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/sede/activos");
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      };
      let getSedeInactivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/sede/inactivos");
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      };
    let agregarSede = async (sede) => {
        try {
            const res = await axios.post("http://localhost:4600/api/sede",sede,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
              console.log(useUsuario.token);
            console.log("SEDE agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }
    };
    
    let actualizarSede= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/sede/actualizar/${usuario._id}`,usuario);
            console.log("sede actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar sede:", error);
            throw error; 
          }
    };
    let desactivarSede = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/sede/desactivar/${usuario._id}`);
            console.log("plan desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let activarSede = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/sede/activar/${usuario._id}`);
            console.log("Usuario desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    return {
        getSede,agregarSede,actualizarSede,activarSede,desactivarSede,getSedeActivos,getSedeInactivos
    };
});