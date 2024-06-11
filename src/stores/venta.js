import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useVentaStore = defineStore("Venta", () => {
    let useUsuario = useUsuarioStore();

    let getVenta = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/venta",{
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
    let getInventario = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/inventario",{
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
    let agregarVenta = async (venta) => {
        try {
            const res = await axios.post("http://localhost:4600/api/venta",venta,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("venta agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar venta1:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }
          
          
    };
    let actualizarVenta= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/venta/actualizar/${usuario._id}`,usuario,{
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
    const getVentaID = async (sedeId) => {
      try {
          let res = await axios.get(`http://localhost:4600/api/venta/${sedeId}`,{
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
        getVenta,agregarVenta,actualizarVenta,getInventario,getVentaID
    };
});