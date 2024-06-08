import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const usePagoStore = defineStore("Venta", () => {
    let getPago = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/pago");
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
            let res = await axios.get("http://localhost:4600/api/plan");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let getCliente = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/clientes");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let agregarPago = async (plan) => {
        try {
            const res = await axios.post("http://localhost:4600/api/pago",plan, {
                headers: {
                  "x-token": token.value,
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
            const res = await axios.put(`http://localhost:4600/api/pago/actualizar/${usuario._id}`,usuario);
            console.log("pago actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; 
          }
    };
    let desactivarPago= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/pago/desactivar/${usuario._id}`);
            console.log("Pago desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar Pago:", error);
            throw error;
        }
    };
    let activarPago = async (pagos) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/pago/activar/${pagos._id}`);
            console.log("Pago desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    return {
        getPago,getCliente,getPlan,agregarPago,actualizarPago,activarPago,desactivarPago
    };
});