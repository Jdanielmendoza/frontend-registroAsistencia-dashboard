import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormLoginComponent } from './form-login/form-login.component';
import { authGuard } from './guards/auth.guard';
import { authenticatedGuard } from './guards/authenticated.guard';
import { AdminComponent } from './pages/user/admin/admin.component';
import { DocenteComponent } from './pages/user/docente/docente.component';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { FacultadComponent } from './pages/facultad/facultad.component';
import { CarreraComponent } from './pages/carrera/carrera.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent:()=> DashboardComponent,
    children:[{
        path: 'administrador',
        title:'admin',
        loadComponent:()=> AdminComponent
    },{
      path: 'docente',
      title:'docente',
      loadComponent:()=> DocenteComponent
    }, {
      path: 'modulo',
      title: 'modulo', 
      loadComponent: ()=>ModulosComponent
    }, {
      path: 'facultad',
      title: 'facultad', 
      loadComponent: ()=> FacultadComponent
    },{
      path: 'carrera',
      title: 'carrera', 
      loadComponent: ()=> CarreraComponent
    }],
    canActivate: [authGuard],
  },
  { path: 'login', component: FormLoginComponent , canActivate:[authenticatedGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirigir a login por defecto
  { path: '**', redirectTo: '/login' }, // Manejo de rutas no encontradas
];

