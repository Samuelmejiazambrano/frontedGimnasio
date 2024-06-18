import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useMantenimientoStore = defineStore("Mantenimiento", () => {
    let useUsuario = useUsuarioStore();

    let getMantenimiento = async () => {
        try {
            let res = await axios.get("/mantenimiento",{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let getMaquina = async () => {
        try {
            let res = await axios.get("/maquinas",{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let agregarMantenimiento = async (inventario) => {
        try {
            const res = await axios.post("/mantenimiento",inventario,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("mantenimiento agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar mantenimiento:", error);
            throw error; 
          }
    };
    let getUsuario = async () => {
        try {
          let res = await axios.get("/usuario",{
            headers: {
              "x-token":useUsuario.token,
            },
          });
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      };
      let actualizarMantenimiento= async (usuario) => {
        try {
            const res = await axios.put(`/mantenimiento/actualizar/${usuario._id}`,usuario,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("mantenimiento actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar mantenimiento:", error);
            throw error; 
          }
    };
      
    let desactivarMantenimiento = async (usuario) => {
        try {
            const res = await axios.put(`/mantenimiento/desactivar/${usuario._id}`,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("plan desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let activarMantenimiento= async (usuario) => {
        try {
            const res = await axios.put(`/mantenimiento/activar/${usuario._id}`,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Usuario desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        };
    };
    const getMantenimientoID = async (sedeId) => {
        try {
            let res = await axios.get(`/mantenimiento/${sedeId}`,{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    return {
        getMantenimiento,getMaquina,agregarMantenimiento,getUsuario,actualizarMantenimiento,activarMantenimiento,desactivarMantenimiento,getMantenimientoID
    };
});