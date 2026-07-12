import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./pages/usuarios/usuarios.page').then((m) => m.UsuariosPage),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/roles/roles.page').then((m) => m.RolesPage),
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito.page').then((m) => m.CarritoPage),
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./pages/pedidos/pedidos.page').then((m) => m.PedidosPage),
  },
  {
    path: 'entregas',
    loadComponent: () =>
      import('./pages/entregas/entregas.page').then((m) => m.EntregasPage),
  },
  {
    path: 'calificaciones',
    loadComponent: () =>
      import('./pages/calificaciones/calificaciones.page').then((m) => m.CalificacionesPage),
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
 
  {
    path: 'categorias',
    loadComponent: () => import('./pages/categorias/categorias.page').then( m => m.CategoriasPage)
  },
  
  {
    path: 'mysticbox',
    loadComponent: () => import('./pages/mysticbox/mysticbox.page').then( m => m.MysticboxPage)
  },

 {
    path: '**',
    redirectTo: 'login',
  },

];