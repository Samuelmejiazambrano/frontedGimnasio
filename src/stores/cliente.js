import { defineStore } from "pinia";
import axios from "axios";
import { useUsuarioStore } from "../stores/usuario.js";

export const useClienteStore = defineStore("Cliente", () => {
    let useUsuario = useUsuarioStore();

    let getCliente = async () => {
        try {
            let res = await axios.get("/clientes",{
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

    let getCumpleanos = async () => {
        try {
            let res = await axios.get("/clientes/listar/cumpleanos",{
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

    let totalCliente = async () => {
        try {
            let res = await axios.get("/clientes/total/clientes",{
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

    const getClientesPorPlan = async (planId) => {
        try {
            let res = await axios.get(`/clientes/clientes/plan/${planId}`,{
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

    let getPlan = async () => {
        try {
            let res = await axios.get("/plan",{
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

    let postCliente = async (ingreso) => {
        try {
            let res = await axios.post("/clientes", ingreso,{
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

 // cliente.js
let postSeguimiento = async (usuarioId, seguimientoData) => {
  try {
  console.log(usuarioId);
    let res = await axios.post(`/clientes/seguimiento/${usuarioId}`, seguimientoData, {
      headers: {
        "x-token": useUsuario.token,
      },
    });

    console.log(usuarioId);
    return res.data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
};

  

    let desactivarCliente = async (usuario) => {
        try {
            const res = await axios.put(`/clientes/desactivar/${usuario._id}`,"",{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Cliente desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar cliente:", error);
            throw error;
        }
    };

    let activarCliente = async (usuario) => {
        try {
            const res = await axios.put(`/clientes/activar/${usuario._id}`,"",{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Cliente activado:", res.data);
        } catch (error) {
            console.error("Error al activar cliente:", error);
            throw error;
        }
    };

    let actualizarCliente = async (usuario) => {
        try {
            const res = await axios.put(`/clientes/${usuario._id}`, usuario,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("Cliente actualizado:", res.data);
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            throw error;
        }
    };

    let actualizarSeguimiento = async (clienteId, seguimientoId, datosSeguimiento) => {
      try {
        const res = await axios.put(`/clientes/${clienteId}/seguimiento/${seguimientoId}`, datosSeguimiento, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        console.log("Seguimiento actualizado:", res.data);
        return res.data;
      } catch (error) {
        console.error("Error al actualizar seguimiento:", error);
        throw error;
      }
    };
    
    
    const getClienteID = async (planId) => {
        try {
            let res = await axios.get(`/clientes/${planId}`,{
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
        getCliente,
        postCliente,
        getCumpleanos,
        totalCliente,
        getClientesPorPlan,
        getPlan,
        desactivarCliente,
        activarCliente,
        postSeguimiento,
        actualizarCliente,
        actualizarSeguimiento,
        getClienteID
    };
});
