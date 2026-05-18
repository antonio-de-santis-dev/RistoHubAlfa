// PERCORSO: src/main/webapp/app/home/home.component.ts

import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { IMenu } from 'app/entities/menu/menu.model';

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

  // QR modal
  qrVisible = false;
  qrUrl = '';
  qrImageUrl = '';

  // Conferma eliminazione
  confermaEliminazioneVisibile = false;
  menuDaEliminare: IMenu | null = null;

  // Toast
  toastMsg = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

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

  visualizza(menuId: number): void {
    this.router.navigate(['/menu-view', menuId]);
  }

  modifica(menuId: number): void {
    this.router.navigate(['/menu-wizard-edit', menuId]);
  }

  // ── QR ──────────────────────────────────────────────

  mostraQr(menuId: number): void {
    this.qrUrl = `${window.location.origin}/menu-public/${menuId}`;
    this.qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(this.qrUrl)}`;
    this.qrVisible = true;
  }

  chiudiQr(): void {
    this.qrVisible = false;
  }

  // ── Elimina ──────────────────────────────────────────

  chiediConfermaElimina(menu: IMenu): void {
    this.menuDaEliminare = menu;
    this.confermaEliminazioneVisibile = true;
  }

  annullaElimina(): void {
    this.confermaEliminazioneVisibile = false;
    this.menuDaEliminare = null;
  }

  confermaElimina(): void {
    if (!this.menuDaEliminare?.id) return;
    this.menuService.delete(this.menuDaEliminare.id).subscribe({
      next: () => {
        this.menus.update(list => list.filter(m => m.id !== this.menuDaEliminare!.id));
        this.confermaEliminazioneVisibile = false;
        this.menuDaEliminare = null;
        this.showToast('Menu eliminato con successo', 'success');
      },
      error: () => {
        this.showToast("Errore durante l'eliminazione", 'error');
      },
    });
  }

  // ── Toast ────────────────────────────────────────────

  showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.toastMsg = msg;
    this.toastType = type;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMsg = '';
    }, 2800);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
}
