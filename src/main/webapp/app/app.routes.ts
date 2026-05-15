import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  // ── LANDING (root) ────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent),
    pathMatch: 'full',
  },

  // ── NAVBAR (outlet secondario) ────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },

  // ── HOME (dashboard utente loggato) ───────────────────────────────────
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },

  // ── LOGIN ─────────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },

  // ── MENU EDITOR ───────────────────────────────────────────────────────
  {
    path: 'menu-editor/:id',
    loadComponent: () => import('./menu-editor/menu-editor.component'),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Editor Menu',
  },

  // ── MENU WIZARD EDIT ──────────────────────────────────────────────────
  {
    path: 'menu-wizard-edit/:id',
    loadComponent: () => import('./menu-wizard-edit/menu-wizard-edit.component').then(m => m.MenuWizardEditComponent),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Modifica Menu',
  },

  // ── MENU PUBLIC (visualizzazione QR — nessuna autenticazione) ────────
  {
    path: 'menu-public/:id',
    loadComponent: () => import('./menu-public/menu-public.component'),
    title: 'Menu',
  },

  // ── MENU WIZARD ───────────────────────────────────────────────────────
  {
    path: 'menu-wizard',
    loadComponent: () => import('./menu-wizard/menu-wizard.component').then(m => m.MenuWizardComponent),
    canActivate: [UserRouteAccessService],
  },

  // ── MENU VIEW ─────────────────────────────────────────────────────────
  {
    path: 'menu-view/:id',
    loadComponent: () => import('./menu-view/menu-view.component').then(m => m.MenuViewComponent),
    canActivate: [UserRouteAccessService],
  },

  // ── PIATTI DEL GIORNO ────────────────────────────────────────────────
  {
    path: 'piatti-giorno',
    loadComponent: () => import('./piatti-giorno-gestione/piatti-giorno-gestione.component').then(m => m.PiattiGiornoGestioneComponent),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Piatti del Giorno',
  },

  // ── GESTIONE CONTATTI ─────────────────────────────────────────────────
  {
    path: 'contatti',
    loadComponent: () => import('./contatti-gestione/contatti-gestione.component').then(m => m.ContattiGestioneComponent),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Contatti',
  },

  // ── PRODOTTO ADD (con e senza portataId) ──────────────────────────────
  {
    path: 'prodotto-add',
    loadComponent: () => import('./prodotto-add/prodotto-add.component').then(m => m.ProdottoAddComponent),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Gestione Prodotti',
  },
  {
    path: 'prodotto-add/:portataId',
    loadComponent: () => import('./prodotto-add/prodotto-add.component').then(m => m.ProdottoAddComponent),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Gestione Prodotti',
  },

  // ── ADMIN ─────────────────────────────────────────────────────────────
  {
    path: 'admin',
    data: { authorities: [Authority.ADMIN] },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },

  // ── ACCOUNT ───────────────────────────────────────────────────────────
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },

  // ── ENTITÀ JHIPSTER (CRUD generato) ───────────────────────────────────
  {
    path: '',
    loadChildren: () => import('./entities/entity.routes'),
  },

  // ── ERRORI ────────────────────────────────────────────────────────────
  ...errorRoute,
];

export default routes;
