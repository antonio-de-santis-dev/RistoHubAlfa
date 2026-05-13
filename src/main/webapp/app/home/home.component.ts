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

  // Toggle attivo
  toggling: number | null = null;

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
    // Usa queryCurrentUser() per caricare solo i menu dell'utente loggato
    this.menuService.queryCurrentUser().subscribe({
      next: res => {
        this.menus.set(res.body ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback a query generica se l'endpoint non è ancora disponibile
        this.menuService.query().subscribe({
          next: res => {
            this.menus.set(res.body ?? []);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false),
        });
      },
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  visualizza(menuId: number): void {
    this.router.navigate(['/menu-public', menuId]);
  }

  modifica(menuId: number): void {
    this.router.navigate(['/menu-editor', menuId]);
  }

  // ── Toggle Attivo/Inattivo ───────────────────────────────────

  async toggleAttivo(menu: IMenu): Promise<void> {
    if (this.toggling === menu.id) return;
    this.toggling = menu.id!;
    const nuovoStato = !menu.attivo;
    this.menuService.partialUpdate({ id: menu.id!, attivo: nuovoStato }).subscribe({
      next: res => {
        const updated = res.body;
        if (updated) {
          this.menus.update(list => list.map(m => (m.id === menu.id ? { ...m, attivo: nuovoStato } : m)));
          this.showToast(
            nuovoStato ? `✅ "${menu.nome}" è ora visibile ai clienti` : `🔒 "${menu.nome}" è stato nascosto ai clienti`,
            'success',
          );
        }
        this.toggling = null;
      },
      error: () => {
        // Fallback: tenta con update completo
        this.menuService.update({ ...menu, attivo: nuovoStato } as IMenu).subscribe({
          next: () => {
            this.menus.update(list => list.map(m => (m.id === menu.id ? { ...m, attivo: nuovoStato } : m)));
            this.showToast(
              nuovoStato ? `✅ "${menu.nome}" è ora visibile ai clienti` : `🔒 "${menu.nome}" è stato nascosto ai clienti`,
              'success',
            );
            this.toggling = null;
          },
          error: () => {
            this.showToast("❌ Errore durante l'aggiornamento. Riprova.", 'error');
            this.toggling = null;
          },
        });
      },
    });
  }

  // ── QR ──────────────────────────────────────────────

  mostraQr(menuId: number): void {
    this.qrUrl = `${window.location.origin}/menu-public/${menuId}`;
    this.qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(this.qrUrl)}`;
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
        this.showToast('🗑️ Menu eliminato con successo', 'success');
      },
      error: () => {
        this.showToast("❌ Errore durante l'eliminazione", 'error');
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
    }, 3500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
}
