import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Consulta } from './consulta/consulta';
import { Pago } from './pago/pago';
import { AppLayout } from './app-layout/app-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'consulta',
        component: Consulta
      },
      {
        path: 'pago',
        component: Pago
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
