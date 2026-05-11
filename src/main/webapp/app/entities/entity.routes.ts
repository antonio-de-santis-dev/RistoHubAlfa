import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'ristoHubAlfaApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'profilo-ristoratore',
    data: { pageTitle: 'ristoHubAlfaApp.profiloRistoratore.home.title' },
    loadChildren: () => import('./profilo-ristoratore/profilo-ristoratore.routes'),
  },
  {
    path: 'menu',
    data: { pageTitle: 'ristoHubAlfaApp.menu.home.title' },
    loadChildren: () => import('./menu/menu.routes'),
  },
  {
    path: 'portata',
    data: { pageTitle: 'ristoHubAlfaApp.portata.home.title' },
    loadChildren: () => import('./portata/portata.routes'),
  },
  {
    path: 'prodotto',
    data: { pageTitle: 'ristoHubAlfaApp.prodotto.home.title' },
    loadChildren: () => import('./prodotto/prodotto.routes'),
  },
  {
    path: 'allergene',
    data: { pageTitle: 'ristoHubAlfaApp.allergene.home.title' },
    loadChildren: () => import('./allergene/allergene.routes'),
  },
  {
    path: 'piatto-del-giorno',
    data: { pageTitle: 'ristoHubAlfaApp.piattoDelGiorno.home.title' },
    loadChildren: () => import('./piatto-del-giorno/piatto-del-giorno.routes'),
  },
  {
    path: 'lista-contatti',
    data: { pageTitle: 'ristoHubAlfaApp.listaContatti.home.title' },
    loadChildren: () => import('./lista-contatti/lista-contatti.routes'),
  },
  {
    path: 'contatto-item',
    data: { pageTitle: 'ristoHubAlfaApp.contattoItem.home.title' },
    loadChildren: () => import('./contatto-item/contatto-item.routes'),
  },
  {
    path: 'traduzione-menu',
    data: { pageTitle: 'ristoHubAlfaApp.traduzioneMenu.home.title' },
    loadChildren: () => import('./traduzione-menu/traduzione-menu.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
