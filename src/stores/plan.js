import { defineStore } from "pinia";
import axios from "axios";
import { useUsuarioStore } from "../stores/usuario.js";


export const usePlanStore = defineStore("planes", () => {
    let useUsuario = useUsuarioStore();

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
    let getPlanActivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/plan/activos");
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      };
      let getPlanInactivos = async () => {
        try {
          let res = await axios.get("http://localhost:4600/api/plan/inactivos");
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      };
    let agregarPlan = async (plan) => {
        try {
            const res = await axios.post("http://localhost:4600/api/plan",plan,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("plan agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar plan:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }
    };
    // let activarPlan = async (plan) => {
    //     try {
    //         const res = await axios.put(`http://localhost:4600/api/plan/activar/${plan._id}`);
    //         console.log("plan agregado:", res.data);
           
    //       } catch (error) {
    //         console.error("Error al agregar plan:", error);
    //         throw error; // Propagar el error para manejarlo en el componente
    //       }
    // };
    
    let UpdatePlan = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/plan/actualizar/${usuario._id}`, usuario);
            console.log("Usuario actualizado:", res.data);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            throw error;
        }
    };
    let desactivarPlan = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/plan/desactivar/${usuario._id}`);
            console.log("plan desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    let activarPlan = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/plan/activar/${usuario._id}`);
            console.log("Usuario desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }
    };
    return {
        getPlan,agregarPlan,activarPlan,UpdatePlan,desactivarPlan,getPlanActivos,getPlanInactivos
    };
});