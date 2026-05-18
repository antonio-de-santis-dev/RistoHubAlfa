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
  readonly totalSteps = 4;
  isLoading = false;
  erroreCreazione: string | null = null;

  // ── Step 1: Colori ────────────────────────────────────────────
  colorePrimario = '#C8102E';
  coloreSecondario = '#F5E6C8';
  coloriConsigliati = [
    { primario: '#C8102E', secondario: '#F5E6C8', nome: 'Rosso Classico' },
    { primario: '#2C3E50', secondario: '#ECF0F1', nome: 'Blu Notte' },
    { primario: '#27AE60', secondario: '#FDFEFE', nome: 'Verde Fresco' },
    { primario: '#8E44AD', secondario: '#FAD7A0', nome: 'Viola Elegante' },
    { primario: '#E67E22', secondario: '#FEF9E7', nome: 'Arancio Caldo' },
    { primario: '#1A1A1A', secondario: '#F8F8F8', nome: 'Nero Minimalista' },
  ];

  // ── Step 2: Font ──────────────────────────────────────────────
  fontSelezionato = 'Playfair Display';
  fontsConsigliati = [
    { nome: 'Playfair Display', esempio: 'Antipasto della Casa', tag: 'Elegante' },
    { nome: 'Lato', esempio: 'Antipasto della Casa', tag: 'Moderno' },
    { nome: 'Merriweather', esempio: 'Antipasto della Casa', tag: 'Classico' },
    { nome: 'Montserrat', esempio: 'Antipasto della Casa', tag: 'Contemporaneo' },
    { nome: 'Cormorant Garamond', esempio: 'Antipasto della Casa', tag: 'Raffinato' },
  ];

  // ── Step 3: Logo ──────────────────────────────────────────────
  logoPreview: string | null = null;
  logoFile: File | null = null;
  logoBase64: string | null = null;
  logoContentType: string | null = null;

  // ── Step 4: Nome, Descrizione, Portate ────────────────────────
  nomeMenu = '';
  descrizioneMenu = '';
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

  ngOnInit(): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Cormorant+Garamond:wght@400;700&display=swap';
    document.head.appendChild(link);
  }

  // ── Navigazione step ──────────────────────────────────────────

  stepSuccessivo(): void {
    if (this.validaStep()) this.currentStep++;
  }

  stepPrecedente(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  validaStep(): boolean {
    if (this.currentStep === 4) {
      return this.nomeMenu.trim().length >= 2 && this.portateSelezionate.size > 0;
    }
    return true;
  }

  // ── Colori ────────────────────────────────────────────────────

  selezionaColori(c: { primario: string; secondario: string }): void {
    this.colorePrimario = c.primario;
    this.coloreSecondario = c.secondario;
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
      const currentUser = await firstValueFrom(this.http.get<AccountInfo>('/api/account'));

      const body: Record<string, unknown> = {
        nome: this.nomeMenu.trim(),
        descrizione: this.descrizioneMenu.trim() || null,
        attivo: true,
        ristoratore: { id: currentUser.id, login: currentUser.login },
        // ── NUOVO: salva i campi stile scelti nel wizard ──
        colorePrimario: this.colorePrimario,
        coloreSecondario: this.coloreSecondario,
        fontMenu: this.fontSelezionato,
      };

      if (this.logoBase64 && this.logoContentType) {
        body['logo'] = this.logoBase64;
        body['logoContentType'] = this.logoContentType;
      }

      const menu = await firstValueFrom(this.http.post<MenuCreato>('/api/menus', body));

      const richiesteDefault = Array.from(this.portateSelezionate).map(p =>
        firstValueFrom(this.http.post('/api/portatas', { tipo: 'DEFAULT', nomeDefault: p, menu: { id: menu.id } })),
      );

      const richiesteCustom = this.portatePersonalizzate.map(n =>
        firstValueFrom(this.http.post('/api/portatas', { tipo: 'PERSONALIZZATA', nomePersonalizzato: n, menu: { id: menu.id } })),
      );

      await Promise.all([...richiesteDefault, ...richiesteCustom]);

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
    const t: Record<number, string> = {
      1: 'Scegli i colori',
      2: 'Scegli il font',
      3: 'Carica il logo',
      4: 'Aggiungi le portate',
    };
    return t[this.currentStep] ?? '';
  }
}
