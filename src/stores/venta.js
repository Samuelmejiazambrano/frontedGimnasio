import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


export const useVentaStore = defineStore("Venta", () => {
    let useUsuario = useUsuarioStore();

    let getVenta = async () => {
        try {
            let res = await axios.get("/venta",{
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
    let agregarVenta = async (venta) => {
        try {
            const res = await axios.post("/venta",venta,{
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
            const res = await axios.put(`/venta/actualizar/${usuario._id}`,usuario,{
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
          let res = await axios.get(`/venta/${sedeId}`,{
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
  const getTotalVentasEntreFechas = async (fechaInicio, fechaFin) => {
    try {
    console.log(fechaFin);
    console.log(fechaInicio);

      let res = await axios.get(`/venta/fechas/`, {
        params: {fechaInicio,fechaFin },
        headers: {
          "x-token": useUsuario.token,
        },
        
      });
    
      return res.data;
    } catch (error) {
      console.error("Error al obtener el total de ventas entre fechas:", error);
      throw error;
    }
  };
  let getTotal = async () => {
    try {
        let res = await axios.get("/venta/total",{
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
        getVenta,agregarVenta,actualizarVenta,getInventario,getVentaID,getTotalVentasEntreFechas,getTotal
    };
});