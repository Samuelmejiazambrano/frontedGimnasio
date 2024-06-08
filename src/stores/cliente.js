import { defineStore } from "pinia";
import axios from "axios";

export const useClienteStore = defineStore("Cliente", () => {
    let getCliente = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/clientes");
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    let getCumpleanos = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/clientes/listar/cumpleanos");
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    let totalCliente = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/clientes/total/clientes");
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const getClientesPorPlan = async (planId) => {
        try {
            let res = await axios.get(`http://localhost:4600/api/clientes/clientes/plan/${planId}`);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    let getPlan = async () => {
        try {
            let res = await axios.get("http://localhost:4600/api/plan");
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    let postCliente = async (ingreso) => {
        try {
            let res = await axios.post("http://localhost:4600/api/clientes", ingreso);
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    let postSeguimiento = async (usuario, seguimientoData) => {
        try {
            let res = await axios.post(`http://localhost:4600/api/clientes/seguimiento/${usuario._id}`, seguimientoData);
            return res.data;
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            throw error;
        }
    };

    let desactivarCliente = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/clientes/desactivar/${usuario._id}`);
            console.log("Cliente desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar cliente:", error);
            throw error;
        }
    };

    let activarCliente = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/clientes/activar/${usuario._id}`);
            console.log("Cliente activado:", res.data);
        } catch (error) {
            console.error("Error al activar cliente:", error);
            throw error;
        }
    };

    let actualizarCliente = async (usuario) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/clientes/${usuario._id}`, usuario);
            console.log("Cliente actualizado:", res.data);
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            throw error;
        }
    };

    let actualizarSeguimiento = async (clienteId, seguimientoId, datosSeguimiento) => {
        try {
            const res = await axios.put(`http://localhost:4600/api/clientes/${clienteId}/seguimiento/${seguimientoId}`, datosSeguimiento);
            console.log("Seguimiento actualizado:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al actualizar seguimiento:", error);
            throw error;
        }
    };
    const getClienteID = async (planId) => {
        try {
            let res = await axios.get(`http://localhost:4600/api/clientes/${planId}`);
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
