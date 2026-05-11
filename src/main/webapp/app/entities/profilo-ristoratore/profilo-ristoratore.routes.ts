import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ProfiloRistoratoreResolve from './route/profilo-ristoratore-routing-resolve.service';

const profiloRistoratoreRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/profilo-ristoratore.component').then(m => m.ProfiloRistoratoreComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/profilo-ristoratore-detail.component').then(m => m.ProfiloRistoratoreDetailComponent),
    resolve: {
      profiloRistoratore: ProfiloRistoratoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/profilo-ristoratore-update.component').then(m => m.ProfiloRistoratoreUpdateComponent),
    resolve: {
      profiloRistoratore: ProfiloRistoratoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/profilo-ristoratore-update.component').then(m => m.ProfiloRistoratoreUpdateComponent),
    resolve: {
      profiloRistoratore: ProfiloRistoratoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default profiloRistoratoreRoute;
