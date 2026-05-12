// PERCORSO: src/main/webapp/app/app.routes.ts
// → SOSTITUISCE il file generato da JHipster
// Aggiunge le route custom: /menu-editor/:id, /menu-public/:id,
// /piatti-giorno, /contatti, /admin/utenti

import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  // ── Home ─────────────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },

  // ── Navbar outlet ────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },

  // ── Login ────────────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },

  // ── Menu Editor ──────────────────────────────────────────────────────────
  // Accessibile solo agli utenti autenticati.
  {
    path: 'menu-editor/:id',
    loadComponent: () => import('./menu-editor/menu-editor.component'),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Editor Menu',
  },

  // ── Menu Public (visualizzazione QR) ─────────────────────────────────────
  // Accessibile senza autenticazione — standalone, nessun navbar.
  {
    path: 'menu-public/:id',
    loadComponent: () => import('./menu-public/menu-public.component'),
    title: 'Menu',
  },

  // ── Piatti del Giorno ────────────────────────────────────────────────────
  {
    path: 'piatti-giorno',
    loadComponent: () => import('./piatti-giorno/piatti-giorno-gestione.component').then(m => m.PiattiGiornoGestioneComponent),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Piatti del Giorno',
  },

  // ── Gestione Contatti ────────────────────────────────────────────────────
  {
    path: 'contatti',
    loadComponent: () => import('./contatti-gestione/contatti-gestione.component').then(m => m.ContattiGestioneComponent),
    canActivate: [UserRouteAccessService],
    data: { authorities: [Authority.USER] },
    title: 'Contatti',
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  {
    path: 'admin',
    data: { authorities: [Authority.ADMIN] },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },

  // ── Account ──────────────────────────────────────────────────────────────
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },

  // ── Entità JHipster (CRUD generato) ──────────────────────────────────────
  {
    path: '',
    loadChildren: () => import('./entities/entity.routes'),
  },

  // ── Errori ───────────────────────────────────────────────────────────────
  ...errorRoute,
];

export default routes;
