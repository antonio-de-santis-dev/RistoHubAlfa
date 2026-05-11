import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ListaContattiResolve from './route/lista-contatti-routing-resolve.service';

const listaContattiRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/lista-contatti.component').then(m => m.ListaContattiComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/lista-contatti-detail.component').then(m => m.ListaContattiDetailComponent),
    resolve: {
      listaContatti: ListaContattiResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/lista-contatti-update.component').then(m => m.ListaContattiUpdateComponent),
    resolve: {
      listaContatti: ListaContattiResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/lista-contatti-update.component').then(m => m.ListaContattiUpdateComponent),
    resolve: {
      listaContatti: ListaContattiResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default listaContattiRoute;
