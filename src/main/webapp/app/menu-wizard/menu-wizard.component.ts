// PERCORSO: src/main/webapp/app/menu-wizard/menu-wizard.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface AccountInfo {
  id: number;
  login: string;
}

interface MenuCreato {
  id: number;
  nome?: string;
}

@Component({
  selector: 'jhi-menu-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu-wizard.component.html',
  styleUrls: ['./menu-wizard.component.scss'],
})
export class MenuWizardComponent implements OnInit {
  currentStep = 1;
  readonly totalSteps = 3;
  isLoading = false;
  erroreCreazione: string | null = null;

  // ── Step 1: Informazioni ───────────────────────────────────────
  nomeMenu = '';
  descrizioneMenu = '';

  // ── Step 2: Logo ───────────────────────────────────────────────
  logoPreview: string | null = null;
  logoFile: File | null = null;
  logoBase64: string | null = null;
  logoContentType: string | null = null;

  // ── Step 3: Portate ────────────────────────────────────────────
  portateDefault = [
    'ANTIPASTO',
    'PRIMO',
    'SECONDO',
    'CONTORNO',
    'BEVANDA',
    'BIRRA',
    'VINO_ROSSO',
    'VINO_ROSATO',
    'VINO_BIANCO',
    'DOLCE',
    'DIGESTIVO',
  ];
  portateSelezionate: Set<string> = new Set(['ANTIPASTO', 'PRIMO', 'SECONDO', 'DOLCE']);
  portatePersonalizzate: string[] = [];
  nuovaPortataCustom = '';

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {}

  // ── Navigazione step ──────────────────────────────────────────

  stepSuccessivo(): void {
    if (this.validaStep()) this.currentStep++;
  }

  stepPrecedente(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  validaStep(): boolean {
    if (this.currentStep === 1) return this.nomeMenu.trim().length >= 2;
    if (this.currentStep === 3) return this.portateSelezionate.size > 0;
    return true;
  }

  // ── Logo ──────────────────────────────────────────────────────

  onLogoSelezionato(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.logoFile = file;
    this.logoContentType = file.type;
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      this.logoPreview = result;
      this.logoBase64 = result.split(',')[1] ?? null;
    };
    reader.readAsDataURL(file);
  }

  rimuoviLogo(): void {
    this.logoFile = null;
    this.logoPreview = null;
    this.logoBase64 = null;
    this.logoContentType = null;
  }

  // ── Portate ───────────────────────────────────────────────────

  togglePortata(p: string): void {
    if (this.portateSelezionate.has(p)) this.portateSelezionate.delete(p);
    else this.portateSelezionate.add(p);
  }

  aggiungiPortataCustom(): void {
    const n = this.nuovaPortataCustom.trim();
    if (n && !this.portatePersonalizzate.includes(n)) {
      this.portatePersonalizzate.push(n);
      this.nuovaPortataCustom = '';
    }
  }

  rimuoviPortataCustom(nome: string): void {
    this.portatePersonalizzate = this.portatePersonalizzate.filter(p => p !== nome);
  }

  nomeLeggibile(p: string): string {
    return p
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }

  // ── Creazione menu ────────────────────────────────────────────

  async generaMenu(): Promise<void> {
    if (!this.validaStep()) return;
    this.isLoading = true;
    this.erroreCreazione = null;

    try {
      // 1. Legge account corrente
      const currentUser = await firstValueFrom(this.http.get<AccountInfo>('/api/account'));

      // 2. Crea il menu (include logo se presente)
      const body: Record<string, unknown> = {
        nome: this.nomeMenu.trim(),
        descrizione: this.descrizioneMenu.trim() || null,
        attivo: true,
        ristoratore: { id: currentUser.id, login: currentUser.login },
      };
      if (this.logoBase64 && this.logoContentType) {
        body['logo'] = this.logoBase64;
        body['logoContentType'] = this.logoContentType;
      }

      const menu = await firstValueFrom(this.http.post<MenuCreato>('/api/menus', body));

      // 3. Crea portate default in parallelo
      const richiesteDefault = Array.from(this.portateSelezionate).map(p =>
        firstValueFrom(
          this.http.post('/api/portatas', {
            tipo: 'DEFAULT',
            nomeDefault: p,
            menu: { id: menu.id },
          }),
        ),
      );

      // 4. Crea portate personalizzate in parallelo
      const richiesteCustom = this.portatePersonalizzate.map(n =>
        firstValueFrom(
          this.http.post('/api/portatas', {
            tipo: 'PERSONALIZZATA',
            nomePersonalizzato: n,
            menu: { id: menu.id },
          }),
        ),
      );

      await Promise.all([...richiesteDefault, ...richiesteCustom]);

      // 5. Naviga al menu-view
      this.router.navigate(['/menu-view', menu.id]);
    } catch (err) {
      console.error('Errore creazione menu:', err);
      this.erroreCreazione = 'Errore durante la creazione del menu. Riprova.';
      this.isLoading = false;
    }
  }

  // ── Computed ──────────────────────────────────────────────────

  get progressoPercentuale(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  get titoloStep(): string {
    const titoli: Record<number, string> = {
      1: 'Informazioni menu',
      2: 'Carica il logo (opzionale)',
      3: 'Scegli le portate',
    };
    return titoli[this.currentStep] ?? '';
  }
}
