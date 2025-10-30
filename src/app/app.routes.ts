import { Routes } from '@angular/router';
import {Home} from './routes/home/home';
import {authGuard} from './guards/auth-guard';
import {Login} from './routes/login/login';
import {Members} from './routes/members/members/members';
import {Edit} from './routes/members/edit/edit';
import {NotFound} from './routes/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'members',
    component: Members,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'edit/:id',
        component: Edit
      }
    ]
  },
  {
    path: '**',
    component: NotFound,

  },
];
