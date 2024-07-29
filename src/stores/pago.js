import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";


    
export const usePagoStore = defineStore("Venta", () => {
    let useUsuario = useUsuarioStore();
    let getPago = async () => {
        try {
            let res = await axios.get("/pago",{
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
    // let agregarVenta = async (venta) => {
    //     try {
    //         const res = await axios.post("http://localhost:4600/api/venta",venta);
    //         console.log("venta agregado:", res.data);
           
    //       } catch (error) {
    //         console.error("Error al agregar venta1:", error);
    //         throw error; // Propagar el error para manejarlo en el componente
    //       }
    // };
    let getPlan = async () => {
        try {
            let res = await axios.get("/plan",{
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
    const getTotalVentasEntreFechas = async (fechaInicio, fechaFin) => {
      try {
      console.log(fechaFin);
      console.log(fechaInicio);
  
        let res = await axios.get(`pago/fechas/`, {
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
    let agregarPago = async (plan) => {
        try {
            const res = await axios.post("/pago",plan,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
              
            console.log("plan agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar pago:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }
    };
    let actualizarPago= async (usuario) => {
        try {
            const res = await axios.put(`/pago/actualizar/${usuario._id}`,usuario,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
              console.log("hola"+usuario);
              console.log(usuario);

            console.log("pago actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; 
          }
    };
    let desactivarPago= async (usuario) => {
        try {
            const res = await axios.put(`/pago/desactivar/${usuario._id}`,"",{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Pago desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar Pago:", error);
            throw error;
        }
    };
    let activarPago = async (pagos) => {
        try {
            const res = await axios.put(`/pago/activar/${pagos._id}`,"",{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Pago desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    const getPagoID = async (sedeId) => {
      try {
          let res = await axios.get(`/pago/${sedeId}`,{
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
  let getPagoActivos = async () => {
    try {
      let res = await axios.get("/pago/activos",{
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
  let getPagoInactivos = async () => {
    try {
      let res = await axios.get("/pago/inactivos/",{
        headers: {
          "x-token":useUsuario.token
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
        getPago,getCliente,getPlan,agregarPago,actualizarPago,activarPago,desactivarPago,getPagoID,getPagoActivos,getPagoInactivos,getTotalVentasEntreFechas
    };
});