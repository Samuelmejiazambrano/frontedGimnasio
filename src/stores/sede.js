import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useSedeStore = defineStore("sede", () => {
    let useUsuario = useUsuarioStore();

    let getSede = async () => {
        try {
            let res = await axios.get("/sede",{
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
    let getSedeActivos = async () => {
        try {
          let res = await axios.get("/sede/activos",{
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
      let getSedeInactivos = async () => {
        try {
          let res = await axios.get("/sede/inactivos",{
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
    let agregarSede = async (sede) => {
        try {
            const res = await axios.post("/sede",sede,{
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
            const res = await axios.put(`/sede/actualizar/${usuario._id}`,usuario,{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            console.log("sede actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar sede:", error);
            throw error; 
          }
    };
    let desactivarSede = async (usuario) => {
        try {
            const res = await axios.put(`/sede/desactivar/${usuario._id}`,"",{
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
    let activarSede = async (usuario) => {
        try {
            const res = await axios.put(`/sede/activar/${usuario._id}`,"",{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            console.log("Usuario desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    const getSedeID = async (sedeId) => {
      try {
          let res = await axios.get(`/sede/${sedeId}`,{
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
        getSede,agregarSede,actualizarSede,activarSede,desactivarSede,getSedeActivos,getSedeInactivos,getSedeID
    };
});