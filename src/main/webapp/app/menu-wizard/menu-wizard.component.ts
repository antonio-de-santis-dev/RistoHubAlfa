// PERCORSO: src/main/webapp/app/menu-wizard/menu-wizard.component.ts
// Wizard CREAZIONE menu — 4 step (Colori, Logo, Font, Portate).
// Allineato a menu-wizard-edit (nessun step "scelta template").

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { IMenu } from 'app/entities/menu/menu.model';
import { NomePortataDefault } from 'app/entities/enumerations/nome-portata-default.model';
import { TipoPortata } from 'app/entities/enumerations/tipo-portata.model';

@Component({
  selector: 'jhi-menu-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu-wizard.component.html',
  styleUrls: ['./menu-wizard.component.scss'],
})
export class MenuWizardComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  isLoading = false;

  // Step 1 — Colori
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

  // Step 2 — Logo
  logoPreview: string | null = null;
  logoFile: File | null = null;

  // Step 3 — Font
  fontSelezionato = 'Playfair Display';
  fontsConsigliati = [
    { nome: 'Playfair Display', esempio: 'Antipasto della Casa', tag: 'Elegante' },
    { nome: 'Lato', esempio: 'Antipasto della Casa', tag: 'Moderno' },
    { nome: 'Merriweather', esempio: 'Antipasto della Casa', tag: 'Classico' },
    { nome: 'Montserrat', esempio: 'Antipasto della Casa', tag: 'Contemporaneo' },
    { nome: 'Cormorant Garamond', esempio: 'Antipasto della Casa', tag: 'Raffinato' },
  ];

  // Step 4 — Portate + info menu
  portateDefault = Object.values(NomePortataDefault);
  portateSelezionate: Set<string> = new Set(['ANTIPASTO', 'PRIMO', 'SECONDO', 'DOLCE']);
  portatePersonalizzate: string[] = [];
  nuovaPortataCustom = '';
  nomeMenu = '';
  descrizioneMenu = '';

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

  stepSuccessivo(): void {
    if (this.validaStep()) this.currentStep++;
  }
  stepPrecedente(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  validaStep(): boolean {
    if (this.currentStep === 4) {
      return this.nomeMenu.trim() !== '' && this.portateSelezionate.size > 0;
    }
    return true;
  }

  selezionaColori(c: { primario: string; secondario: string }): void {
    this.colorePrimario = c.primario;
    this.coloreSecondario = c.secondario;
  }

  onLogoSelezionato(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.logoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => (this.logoPreview = e.target?.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  rimuoviLogo(): void {
    this.logoFile = null;
    this.logoPreview = null;
  }

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

  get progressoPercentuale(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  get titoloStep(): string {
    const t: Record<number, string> = {
      1: 'Scegli i colori',
      2: 'Carica il logo',
      3: 'Scegli il font',
      4: 'Aggiungi le portate',
    };
    return t[this.currentStep] ?? '';
  }

  async generaMenu(): Promise<void> {
    if (!this.validaStep()) return;
    this.isLoading = true;
    try {
      // 1. Crea menu
      const menu = await firstValueFrom(
        this.http.post<IMenu>('/api/menus', {
          nome: this.nomeMenu,
          descrizione: this.descrizioneMenu,
          attivo: true,
          colorePrimario: this.colorePrimario,
          coloreSecondario: this.coloreSecondario,
          fontMenu: this.fontSelezionato,
        }),
      );

      // 2. Upload logo (se presente)
      if (this.logoFile && menu.id) {
        const formData = new FormData();
        formData.append('file', this.logoFile);
        await firstValueFrom(this.http.post(`/api/menus/${menu.id}/logo/upload`, formData));
      }

      // 3. Crea portate
      let ordine = 1;
      for (const nomeDefault of this.portateSelezionate) {
        await firstValueFrom(
          this.http.post('/api/portatas', {
            tipo: TipoPortata.DEFAULT,
            nomeDefault,
            ordine: ordine++,
            menu: { id: menu.id },
          }),
        );
      }
      for (const nomePersonalizzato of this.portatePersonalizzate) {
        await firstValueFrom(
          this.http.post('/api/portatas', {
            tipo: TipoPortata.PERSONALIZZATA,
            nomePersonalizzato,
            ordine: ordine++,
            menu: { id: menu.id },
          }),
        );
      }

      this.router.navigate(['/menu-view', menu.id]);
    } catch (err) {
      console.error('Errore creazione menu:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
