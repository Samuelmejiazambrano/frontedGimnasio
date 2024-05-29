import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useInventarioStore = defineStore("Inventario", () => {
    let getInventario = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/inventario");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let getTotal = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/inventario/total");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let agregarInvntario = async (inventario) => {
        try {
            const res = await axios.post("http://localhost:4600/api/inventario",inventario);
            console.log("Inventario agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }
    };
    let actualizarInvntario = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/inventario/actualizar/${usuario._id}`,usuario);
            console.log("Inventario actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar inventario:", error);
            throw error; 
          }
    };
   
    
    let EliminarInventario = async (id) => { 
        try {
            const res = await axios.delete(`http://localhost:4600/api/inventario/${id}`);
            console.log("Inventario eliminado:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al eliminar inventario:", error);
            throw error;
        }
    };
    return {
        getInventario,agregarInvntario,actualizarInvntario,EliminarInventario,getTotal
    };
});




