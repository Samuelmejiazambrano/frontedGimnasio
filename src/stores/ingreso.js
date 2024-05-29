import { defineStore } from "pinia";
import axios from "axios";


export const useIngresoStore = defineStore("Ingreso", () => {
    let getIngreso = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/ingreso");
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let getSede = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/sede");
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
    let postIngreso = async (ingreso) => {
        try {
            let res = await axios.post("http://localhost:4600/api/ingreso",ingreso);
            console.log(res);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    let actualizarIngreso = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/ingreso/actualizar/${usuario._id}`,usuario);
            console.log("ingreso actualizado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar ingreso:", error);
            throw error; 
          }
    };
    return {
        getIngreso,postIngreso,getCliente,getSede,actualizarIngreso
    };
});