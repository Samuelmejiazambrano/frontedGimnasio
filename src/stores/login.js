import { defineStore } from "pinia";
import axios from "axios";

export const useLoginStore = defineStore("login", () => {
    const login = async ({ nombre, password }) => {
        try {
            const response = await axios.post("http://localhost:4600/api/usuario/login", {
                nombre: nombre,
                password: password
            });
            return response.data;
        } catch (error) {
            console.error('Error en la solicitud de inicio de sesión:', error);
            throw error; 
        }
    };

    return {
        login,
    };
});
