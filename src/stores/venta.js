import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useVentaStore = defineStore("Venta", () => {
    let getVenta = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/venta");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let agregarVenta = async (venta) => {
        try {
            const res = await axios.post("http://localhost:4600/api/venta",venta);
            console.log("venta agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar venta1:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }
          
          
    };
    let actualizarVenta= async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/venta/actualizar/${usuario._id}`,usuario);
            console.log("sede actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar sede:", error);
            throw error; 
          }
    };
    
    return {
        getVenta,agregarVenta,actualizarVenta
    };
});