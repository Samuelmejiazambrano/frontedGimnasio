import { defineStore } from "pinia";
import axios from "axios";

import { useUsuarioStore } from "../stores/usuario.js";


export const useIngresoStore = defineStore("Ingreso", () => {
    let useUsuario = useUsuarioStore();

    let getIngreso = async () => {
        try {
            let res = await axios.get("/ingreso",{
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
    let getCliente = async () => {
        try {
            let res = await axios.get("/clientes",{
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
    let postIngreso = async (ingreso) => {
      try {
        let res = await axios.post("/ingreso/", ingreso, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        console.log("Response from server (postIngreso):", res);
        return res.data;
      } catch (error) {
        console.error("Error in postIngreso:", error.response ? error.response.data : error);
        return { success: false, message: error.response ? error.response.data.message : error.message };
      }
    };
    
    let actualizarIngreso = async (usuario) => {
        try {
            const res = await axios.put(`/ingreso/actualizar/${usuario._id}`,usuario,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("ingreso actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar ingreso:", error);
            throw error; 
          }
    };
    const getIngresoID = async (sedeId) => {
      try {
          let res = await axios.get(`/ingreso/${sedeId}`,{
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
        getIngreso,postIngreso,getCliente,getSede,actualizarIngreso,getIngresoID
    };
});