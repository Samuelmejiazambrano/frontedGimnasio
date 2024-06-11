import { defineStore } from "pinia";
import axios from "axios";

import { useUsuarioStore } from "../stores/usuario.js";


export const useIngresoStore = defineStore("Ingreso", () => {
    let useUsuario = useUsuarioStore();

    let getIngreso = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/ingreso",{
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
    let getCliente = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/clientes",{
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
            let res = await axios.post("http://localhost:4600/api/ingreso",ingreso,{
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
    let actualizarIngreso = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/ingreso/actualizar/${usuario._id}`,usuario,{
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
          let res = await axios.get(`http://localhost:4600/api/ingreso/${sedeId}`,{
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