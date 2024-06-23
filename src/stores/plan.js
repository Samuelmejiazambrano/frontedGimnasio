import { defineStore } from "pinia";
import axios from "axios";
import { useUsuarioStore } from "../stores/usuario.js";
import { ref } from "vue";


export const usePlanStore = defineStore("planes", () => {
    let useUsuario = useUsuarioStore();
    let loading = ref(false);

    let getPlan = async () => {
       loading.value =true;

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
        }finally {
          loading.value = false;
        }
    };
    let getPlanActivos = async () => {
      loading.value =true;

        try {
          let res = await axios.get("/plan/activos",{
            headers: {
              "x-token":useUsuario.token,
            },
          });
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }finally {
          loading.value = false;
        }
      };
      let getPlanInactivos = async () => {
        loading.value =true;

        try {
          let res = await axios.get("/plan/inactivos",{
            headers: {
              "x-token":useUsuario.token,
            },
          });
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }finally {
          loading.value = false;
        }
      };
    let agregarPlan = async (plan) => {
      loading.value =true;

        try {
            const res = await axios.post("/plan",plan,{
                headers: {
                  "x-token":useUsuario.token,
                },
              });
            console.log("plan agregado:", res.data);
           
          } catch (error) {
            console.error("Error al agregar plan:", error);
            throw error; // Propagar el error para manejarlo en el componente
          }finally {
            loading.value = false;
          }
    };

    
    let UpdatePlan = async (usuario) => {
      loading.value =true;

        try {
            const res = await axios.put(`/plan/actualizar/${usuario._id}`, usuario,{
              headers: {
                "x-token":useUsuario.token
              },
            });
            console.log("Usuario actualizado:", res.data);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            throw error;
        }finally {
          loading.value = false;
        }
    };
    let desactivarPlan = async (usuario) => {
      loading.value =true;

        try {
            const res = await axios.put(`/plan/desactivar/${usuario._id}`,"",{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            
            console.log("plan desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }finally {
          loading.value = false;
        }
    };
    let activarPlan = async (usuario) => {
      loading.value =true;

        try {
            const res = await axios.put(`/plan/activar/${usuario._id}`,"",{
              headers: {
                "x-token":useUsuario.token,
              },
            });
            console.log("Usuario desactivado:", res.data);
        } catch (error) {
            console.error("Error al desactivar plan:", error);
            throw error;
        }finally {
          loading.value = false;
        }
    };
    const getPlanID = async (planId) => {
      loading.value =true;

      try {
          let res = await axios.get(`/plan/${planId}`,{
            headers: {
              "x-token":useUsuario.token,
            },
          });
          return res.data;
      } catch (error) {
          console.log(error);
          return error;
      }finally {
        loading.value = false;
      }
  };
    return {
        getPlan,agregarPlan,activarPlan,UpdatePlan,desactivarPlan,getPlanActivos,getPlanInactivos,getPlanID,loading
    };
});