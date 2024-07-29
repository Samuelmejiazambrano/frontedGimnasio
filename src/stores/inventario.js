import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useInventarioStore = defineStore("Inventario", () => {
    let useUsuario = useUsuarioStore();

    let getInventario = async () => {
        try {
            let res = await axios.get("/inventario",{
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
    let getTotal = async () => {
        try {
            let res = await axios.get("/inventario/total",{
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
    let agregarInvntario = async (inventario) => {
        try {
            const res = await axios.post("/inventario",inventario,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Inventario agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }
    };
    let actualizarInvntario = async (usuario) => {
        try {
            const res = await axios.put(`/inventario/actualizar/${usuario._id}`,usuario,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Inventario actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; 
          }
    };
   
    
    let EliminarInventario = async (id) => { 
        try {
            const res = await axios.delete(`/inventario/${id}`,"",{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Inventario eliminado:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al eliminar inventario:", error);
            throw error;
        }
    };
    
    let desactivarInventario = async (usuario) => {
      try {
          const res = await axios.put(`/inventario/desactivar/${usuario._id}`,"",{
              headers: {
                "x-token":useUsuario.token,
              },
            });
          console.log("Cliente desactivado:", res.data);
      } catch (error) {
          console.error("Error al desactivar cliente:", error);
          throw error;
      }
  };

  let activarInventario = async (usuario) => {
      try {
          const res = await axios.put(`/inventario/activar/${usuario._id}`,"",{
              headers: {
                "x-token":useUsuario.token,
              },
            });
          console.log("Cliente activado:", res.data);
      } catch (error) {
          console.error("Error al activar cliente:", error);
          throw error;
      }
  };
  let getInventarioActivos = async () => {
    try {
      let res = await axios.get("/inventario/activos",{
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
  let getInventarioInactivos = async () => {
    try {
      let res = await axios.get("/inventario/inactivos",{
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
    return {
        getInventario,agregarInvntario,actualizarInvntario,EliminarInventario,getTotal,activarInventario,desactivarInventario,getInventarioActivos,getInventarioInactivos
    };
});




