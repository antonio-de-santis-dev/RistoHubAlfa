import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ContattoItemResolve from './route/contatto-item-routing-resolve.service';

const contattoItemRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/contatto-item.component').then(m => m.ContattoItemComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/contatto-item-detail.component').then(m => m.ContattoItemDetailComponent),
    resolve: {
      contattoItem: ContattoItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/contatto-item-update.component').then(m => m.ContattoItemUpdateComponent),
    resolve: {
      contattoItem: ContattoItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/contatto-item-update.component').then(m => m.ContattoItemUpdateComponent),
    resolve: {
      contattoItem: ContattoItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default contattoItemRoute;
