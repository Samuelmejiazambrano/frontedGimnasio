import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useMaquinaStore = defineStore("Maquinaria", () => {
  let useUsuario = useUsuarioStore();

    let getMaquina = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/maquinas",{
              headers: {
                "x-token":useUsuario.token
              },
              
            });
            console.log("hola");
            console.log(useUsuario.token);
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let agregarMaquinaria = async (usuario) => {
        try {
            const res = await axios.post("http://localhost:4600/api/maquinas",usuario,{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            console.log("Usuario agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error;
          }
    };
    let getSede = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/sede",{
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
    let actualizarMaquina = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/maquinas/actualizar/${usuario._id}`,usuario,{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            console.log("maquina actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; 
          }
    };
    let desactivarMaquina= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/maquinas/desactivar/${usuario._id}`,"",{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            console.log("Maquina desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let activarMaquina = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/maquinas/activar/${usuario._id}`,"",{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            console.log("Maquina desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let getmaquinasActivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/maquinas/activos",{
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
      let getmaquinasInactivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/maquinas/inactivos",{
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
      const getMaquinariaID = async (sedeId) => {
        try {
            let res = await axios.get(`http://localhost:4600/api/maquinas/${sedeId}`,{
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
        getMaquina,agregarMaquinaria,getSede,actualizarMaquina,getmaquinasActivos,getmaquinasInactivos,activarMaquina,desactivarMaquina,getMaquinariaID
    };
});