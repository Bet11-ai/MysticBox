import { Routes } from '@angular/router';

import {
  authGuard
} from './guards/auth.guard';

import {
  adminGuard
} from './guards/admin.guard';

import {
  clienteGuard
} from './guards/cliente.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // =====================================
  // RUTAS PÚBLICAS
  // =====================================

  {
    path: 'login',
    loadComponent: () =>
      import(
        './pages/login/login.page'
      ).then(
        m => m.LoginPage
      )
  },

  {
    path: 'registro',
    loadComponent: () =>
      import(
        './pages/registro/registro.page'
      ).then(
        m => m.RegistroPage
      )
  },

  // =====================================
  // RUTAS DEL CLIENTE
  // =====================================

  {
    path: 'home',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/home/home.page'
      ).then(
        m => m.HomePage
      )
  },

  {
    path: 'carrito',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/carrito/carrito.page'
      ).then(
        m => m.CarritoPage
      )
  },

  {
    path: 'proceso-compra',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/proceso-compra/proceso-compra.page'
      ).then(
        m => m.ProcesoCompraPage
      )
  },

  {
    path: 'pedidos',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/pedidos/pedidos.page'
      ).then(
        m => m.PedidosPage
      )
  },

  {
    path: 'entregas',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/entregas/entregas.page'
      ).then(
        m => m.EntregasPage
      )
  },

  {
    path: 'calificaciones',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/calificaciones/calificaciones.page'
      ).then(
        m => m.CalificacionesPage
      )
  },

  {
    path: 'perfil',
    canActivate: [
      authGuard
    ],
    loadComponent: () =>
      import(
        './pages/perfil/perfil.page'
      ).then(
        m => m.PerfilPage
      )
  },

  {
    path: 'categorias',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/categorias/categorias.page'
      ).then(
        m => m.CategoriasPage
      )
  },

  {
    path: 'mysticbox',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/mysticbox/mysticbox.page'
      ).then(
        m => m.MysticboxPage
      )
  },

  {
    path: 'personalizacion',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/personalizacion/personalizacion.page'
      ).then(
        m => m.PersonalizacionPage
      )
  },

  {
    path: 'factura',
    canActivate: [
      authGuard,
      clienteGuard
    ],
    loadComponent: () =>
      import(
        './pages/factura/factura.page'
      ).then(
        m => m.FacturaPage
      )
  },

  // =====================================
  // RUTAS ADMINISTRATIVAS
  // =====================================

  {
    path: 'admin',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/admin/admin.page'
      ).then(
        m => m.AdminPage
      )
  },

  {
    path: 'usuarios',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/usuarios/usuarios.page'
      ).then(
        m => m.UsuariosPage
      )
  },

  {
    path: 'roles',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/roles/roles.page'
      ).then(
        m => m.RolesPage
      )
  },

  {
    path: 'admin-cajas',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/admin-cajas/admin-cajas.page'
      ).then(
        m => m.AdminCajasPage
      )
  },

  {
    path: 'admin-promociones',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/admin-promociones/admin-promociones.page'
      ).then(
        m => m.AdminPromocionesPage
      )
  },

  {
    path: 'admin-pedidos',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/admin-pedidos/admin-pedidos.page'
      ).then(
        m => m.AdminPedidosPage
      )
  },

  {
    path: 'admin-clientes',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/admin-clientes/admin-clientes.page'
      ).then(
        m => m.AdminClientesPage
      )
  },

  {
    path: 'admin-reportes',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/admin-reportes/admin-reportes.page'
      ).then(
        m => m.AdminReportesPage
      )
  },

  {
    path: 'admin-whitelist',
    canActivate: [
      authGuard,
      adminGuard
    ],
    loadComponent: () =>
      import(
        './pages/admin-whitelist/admin-whitelist.page'
      ).then(
        m => m.AdminWhitelistPage
      )
  },


   {
    path: 'admin-dashboard',
    loadComponent: () =>
      import(
        './pages/admin-dashboard/admin-dashboard.page'
      ).then(
        m => m.AdminDashboardPage
      )
  },

  {
    path: '**',
    redirectTo: 'login'
  },


    

];