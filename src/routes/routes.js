import Compras from "../components/compras.vue";
import Ventas from "../components/Inventario.vue";
import Productos from "../components/productos.vue";
import Usuario from "../components/usuario.vue";
import Maquinaria from "../components/maquinaria.vue";
import Cliente from "../components/cliente.vue";
import Mantenimiento from "../components/mantenimiento.vue";
import Login from "../components/login.vue";
import Registro from "../components/registro.vue";
import Ingreso from "../components/ingresos.vue";
import Venta from "../components/venta.vue";
import Pago from "../components/pagos.vue";
import Home from "../components/home.vue";
import { createRouter, createWebHashHistory } from "vue-router";


import { useUsuarioStore } from "../stores/usuario.js";

const auth = (to,from,next) => {
    if (checkAuth()) {
        const userUsuario = useUsuarioStore()
        const rol = userUsuario.usuario.rol
        console.log(rol);
        if (!to.meta.rol.includes(rol)) {
            return next({ name: 'login' })
        }
        next()
    } else {
        return next({ name:'login' })
    }
}

const checkAuth = () => {
    const useUsuario = useUsuarioStore()
    const token = useUsuario.token
    console.log(token);
    if (!token) return false
    return true
};
const routes = [
    { 
        path: "/", 
        component: Login,
        meta: { hideNavbar: true }
    },
    { 
        path: "/registro", 
        component: Registro,
        meta: { hideNavbar: true }
    },
    { path: "/home", component: Home },
    { path: "/compras", component: Compras, beforeEnter:auth, meta: { rol: ['admin', 'instructor'] } },
    { path: "/ventas", component: Ventas, beforeEnter:auth, meta: { rol: ['admin', 'instructor'] } },
    { path: "/cliente", component: Cliente, beforeEnter: auth, meta: { rol: ['admin', 'recepcionista'] } },
    { path: "/mantenimiento", component: Mantenimiento, beforeEnter: auth, meta: { rol: ['admin', 'recepcionista'] } } ,
    { path: "/usuario", component: Usuario , beforeEnter: auth, meta: { rol: ['admin', 'recepcionista'] }},
    { path: "/venta", component: Venta, beforeEnter: auth, meta: { rol: ['admin', 'instructor'] } },
    { path: "/ingresos", component: Ingreso, beforeEnter: auth, meta: { rol: ['admin', 'recepcionista'] } },
    { path: "/maquinaria", component: Maquinaria, beforeEnter: auth, meta: { rol: ['admin'] } },
    { path: "/pagos", component: Pago, beforeEnter: auth, meta: { rol: ['admin', 'recepcionista'] } },
    { path: "/productos", component: Productos, beforeEnter: auth, meta: { rol: ['admin', 'instructor'] } },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes
});