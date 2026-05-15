// PERCORSO: src/main/webapp/app/layouts/main/main.component.ts
// Sostituisce il file generato da JHipster.
// Aggiunge: LoaderComponent, showNavbar/Footer signals, isFullscreen, route-aware layout.

import { Component, OnInit, Renderer2, RendererFactory2, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import { LoaderComponent } from 'app/shared/loader/loader.component';

// Rotte su cui navbar e footer devono apparire.
// La landing '/', /login, /account/register, /menu-public NON li mostrano.
const ROUTES_WITH_FOOTER = [
  '/home',
  '/admin',
  '/account/password',
  '/account/settings',
  '/entities',
  '/menu-editor',
  '/piatti-giorno',
  '/contatti',
];

const ROUTES_WITH_NAVBAR = [
  '/home',
  '/admin',
  '/account/password',
  '/account/settings',
  '/entities',
  '/menu-editor',
  '/piatti-giorno',
  '/contatti',
  '/menu-wizard',
];

// Rotte fullscreen senza wrapper (menu-public = visualizzazione QR)
const ROUTES_FULLSCREEN = ['/menu-public'];

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, FooterComponent, PageRibbonComponent, LoaderComponent],
})
export default class MainComponent implements OnInit {
  private readonly renderer: Renderer2;

  // Partono da false: nessun flash di footer/navbar durante il caricamento
  // di landing, login, register. Si attivano solo dopo NavigationEnd.
  showFooter = signal(false);
  showNavbar = signal(false);
  isFullscreen = signal(false);

  private readonly router = inject(Router);
  private readonly appPageTitleStrategy = inject(AppPageTitleStrategy);
  private readonly accountService = inject(AccountService);
  private readonly translateService = inject(TranslateService);
  private readonly rootRenderer = inject(RendererFactory2);

  constructor() {
    this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects;
      this.showFooter.set(ROUTES_WITH_FOOTER.some(r => url.startsWith(r)));
      this.showNavbar.set(ROUTES_WITH_NAVBAR.some(r => url.startsWith(r)));
      this.isFullscreen.set(ROUTES_FULLSCREEN.some(r => url.startsWith(r)));
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.appPageTitleStrategy.updateTitle(this.router.routerState.snapshot);
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }
}
