// PERCORSO: src/main/webapp/app/menu-wizard-edit/menu-wizard-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { IMenu } from 'app/entities/menu/menu.model';
import { IPortata } from 'app/entities/portata/portata.model';
import { NomePortataDefault } from 'app/entities/enumerations/nome-portata-default.model';
import { TipoPortata } from 'app/entities/enumerations/tipo-portata.model';

@Component({
  selector: 'jhi-menu-wizard-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu-wizard-edit.component.html',
  styleUrls: ['./menu-wizard-edit.component.scss'],
})
export class MenuWizardEditComponent implements OnInit {
  menuId: string | null = null;
  currentStep = 1;
  totalSteps = 4;
  isLoading = false;
  isLoadingDati = true;

  // Logo esistente
  logoEsistenteUrl: string | null = null;

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

  // Step 4 — Portate
  portateDefault = Object.values(NomePortataDefault);
  portateSelezionate: Set<string> = new Set();
  portatePersonalizzate: string[] = [];
  portateEsistentiIds: { id: number; nomeDefault?: string | null; nomePersonalizzato?: string | null; tipo: string }[] = [];
  nuovaPortataCustom = '';
  nomeMenu = '';
  descrizioneMenu = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Cormorant+Garamond:wght@400;700&display=swap';
    document.head.appendChild(link);

    this.menuId = this.route.snapshot.paramMap.get('id');
    if (this.menuId) {
      this.caricaDatiEsistenti(this.menuId);
    }
  }

  async caricaDatiEsistenti(id: string): Promise<void> {
    try {
      const menu = await firstValueFrom(this.http.get<IMenu>(`/api/menus/${id}`));
      this.nomeMenu = menu.nome ?? '';
      this.descrizioneMenu = menu.descrizione ?? '';

      // ── NUOVO: pre-carica colori e font salvati nel DB ──
      if (menu.colorePrimario) this.colorePrimario = menu.colorePrimario;
      if (menu.coloreSecondario) this.coloreSecondario = menu.coloreSecondario;
      if (menu.fontMenu) this.fontSelezionato = menu.fontMenu;

      // Logo esistente
      if (menu.logo && menu.logoContentType) {
        this.logoEsistenteUrl = `data:${menu.logoContentType};base64,${menu.logo}`;
        this.logoPreview = this.logoEsistenteUrl;
      }

      // Portate esistenti
      const portate = await firstValueFrom(this.http.get<IPortata[]>(`/api/portatas?menuId.equals=${id}&size=100`));
      this.portateEsistentiIds = (portate ?? []).map(p => ({
        id: p.id,
        tipo: p.tipo ?? '',
        nomeDefault: p.nomeDefault ?? null,
        nomePersonalizzato: p.nomePersonalizzato ?? null,
      }));
      (portate ?? []).forEach(p => {
        if (p.tipo === TipoPortata.DEFAULT && p.nomeDefault) {
          this.portateSelezionate.add(p.nomeDefault);
        } else if (p.tipo === TipoPortata.PERSONALIZZATA && p.nomePersonalizzato) {
          this.portatePersonalizzate.push(p.nomePersonalizzato);
        }
      });
    } catch (err) {
      console.error('Errore caricamento dati menu:', err);
    } finally {
      this.isLoadingDati = false;
    }
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
      reader.onload = e => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  rimuoviLogo(): void {
    this.logoFile = null;
    this.logoPreview = null;
    this.logoEsistenteUrl = null;
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

  async salvaModifiche(): Promise<void> {
    if (!this.validaStep() || !this.menuId) return;
    this.isLoading = true;
    try {
      // 1. Aggiorna menu con tutti i campi stile
      const menuPayload = {
        id: Number(this.menuId),
        nome: this.nomeMenu,
        descrizione: this.descrizioneMenu,
        // ── NUOVO: salva colori e font ──
        colorePrimario: this.colorePrimario,
        coloreSecondario: this.coloreSecondario,
        fontMenu: this.fontSelezionato,
      };
      await firstValueFrom(this.http.patch(`/api/menus/${this.menuId}`, menuPayload));

      // 2. Upload logo se selezionato un file nuovo
      if (this.logoFile) {
        const formData = new FormData();
        formData.append('file', this.logoFile);
        await firstValueFrom(this.http.post(`/api/menus/${this.menuId}/logo/upload`, formData));
      }

      // 3. Sincronizza portate DEFAULT
      const portateAttualiDefault = this.portateEsistentiIds.filter(p => p.tipo === TipoPortata.DEFAULT);
      for (const p of portateAttualiDefault) {
        if (!this.portateSelezionate.has(p.nomeDefault ?? '')) {
          await firstValueFrom(this.http.delete(`/api/portatas/${p.id}`));
        }
      }
      const portateGiaPresenti = new Set(portateAttualiDefault.map(p => p.nomeDefault));
      let ordine = portateAttualiDefault.length + 1;
      for (const nomeDefault of this.portateSelezionate) {
        if (!portateGiaPresenti.has(nomeDefault)) {
          await firstValueFrom(
            this.http.post('/api/portatas', {
              tipo: TipoPortata.DEFAULT,
              nomeDefault,
              ordine: ordine++,
              menu: { id: Number(this.menuId) },
            }),
          );
        }
      }

      // 4. Aggiungi portate personalizzate nuove
      const portateCustomAttuali = new Set(
        this.portateEsistentiIds.filter(p => p.tipo === TipoPortata.PERSONALIZZATA).map(p => p.nomePersonalizzato),
      );
      for (const nomePersonalizzato of this.portatePersonalizzate) {
        if (!portateCustomAttuali.has(nomePersonalizzato)) {
          await firstValueFrom(
            this.http.post('/api/portatas', {
              tipo: TipoPortata.PERSONALIZZATA,
              nomePersonalizzato,
              ordine: ordine++,
              menu: { id: Number(this.menuId) },
            }),
          );
        }
      }

      this.router.navigate(['/menu-view', this.menuId]);
    } catch (err) {
      console.error('Errore durante il salvataggio:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
