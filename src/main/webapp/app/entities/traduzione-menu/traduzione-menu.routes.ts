import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TraduzioneMenuResolve from './route/traduzione-menu-routing-resolve.service';

const traduzioneMenuRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/traduzione-menu.component').then(m => m.TraduzioneMenuComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/traduzione-menu-detail.component').then(m => m.TraduzioneMenuDetailComponent),
    resolve: {
      traduzioneMenu: TraduzioneMenuResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/traduzione-menu-update.component').then(m => m.TraduzioneMenuUpdateComponent),
    resolve: {
      traduzioneMenu: TraduzioneMenuResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/traduzione-menu-update.component').then(m => m.TraduzioneMenuUpdateComponent),
    resolve: {
      traduzioneMenu: TraduzioneMenuResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default traduzioneMenuRoute;
