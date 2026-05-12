import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { IMenu } from 'app/entities/menu/menu.model';

/**
 * Percorso: src/main/webapp/app/home/home.component.ts
 * → SOSTITUISCE il file generato da JHipster
 *
 * Se l'utente è loggato mostra direttamente la lista dei suoi menu.
 * Se non è loggato mostra i pulsanti Login / Registrati.
 */
@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);
  menus = signal<IMenu[]>([]);
  isLoading = signal(false);
  errorMaxMenu = signal(false);

  private readonly destroy$ = new Subject<void>();
  private readonly accountService = inject(AccountService);
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account.set(account);
        if (account) {
          this.loadMenus();
        }
      });
  }

  loadMenus(): void {
    this.isLoading.set(true);
    this.menuService.query().subscribe({
      next: res => {
        this.menus.set(res.body ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  goToEditor(menuId: number): void {
    this.router.navigate(['/menu-editor', menuId]);
  }

  goToPreview(menuId: number): void {
    this.router.navigate(['/menu-public', menuId]);
  }

  getQrUrl(menuId: number): string {
    return `${window.location.origin}/menu-public/${menuId}`;
  }

  copyQrLink(menuId: number): void {
    navigator.clipboard.writeText(this.getQrUrl(menuId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
