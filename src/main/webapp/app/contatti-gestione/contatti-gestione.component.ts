// PERCORSO: src/main/webapp/app/contatti-gestione/contatti-gestione.component.ts
// → FILE NUOVO da creare in src/main/webapp/app/contatti-gestione/
//
// Adattato da RistoHub-dev per usare i service JHipster di RistoHubAlfa.

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import ApplicationConfigService from 'app/core/config/application-config.service';
import { IMenu } from 'app/entities/menu/menu.model';
import { IListaContatti } from 'app/entities/lista-contatti/lista-contatti.model';
import { IContattoItem } from 'app/entities/contatto-item/contatto-item.model';
import { MenuService } from 'app/entities/menu/service/menu.service';

// Tipi per i recapiti
export type TipoContatto = 'TELEFONO' | 'EMAIL' | 'SOCIAL' | 'SITO_WEB';
export type TipoSocial =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'X'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'TELEGRAM'
  | 'WHATSAPP'
  | 'MESSENGER'
  | 'THREADS'
  | 'SNAPCHAT'
  | 'GOOGLE'
  | 'TRIPADVISOR'
  | 'ALTRO';

interface ContattoItemForm {
  id?: number;
  tipo: TipoContatto;
  valore: string;
  etichetta?: string;
  reteSociale?: TipoSocial;
  ordine: number;
}

@Component({
  selector: 'app-contatti-gestione',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contatti-gestione.component.html',
  styleUrls: ['./contatti-gestione.component.scss'],
})
export class ContattiGestioneComponent implements OnInit {
  isLoading = true;

  listeContatti = signal<IListaContatti[]>([]);
  menus = signal<IMenu[]>([]);

  // Modal form
  modalAperta = false;
  isEdit = false;
  isSaving = false;
  erroreForm: string | null = null;

  formId: number | null = null;
  formNote = '';
  formMenuId: number | null = null;
  formItems: ContattoItemForm[] = [];

  // Eliminazione
  listaInEliminazione: IListaContatti | null = null;
  isDeleting = false;

  readonly TIPI: TipoContatto[] = ['TELEFONO', 'EMAIL', 'SOCIAL', 'SITO_WEB'];

  readonly RETI_SOCIALI: { value: TipoSocial; label: string }[] = [
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'INSTAGRAM', label: 'Instagram' },
    { value: 'X', label: 'X (Twitter)' },
    { value: 'YOUTUBE', label: 'YouTube' },
    { value: 'TIKTOK', label: 'TikTok' },
    { value: 'TELEGRAM', label: 'Telegram' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
    { value: 'MESSENGER', label: 'Messenger' },
    { value: 'THREADS', label: 'Threads' },
    { value: 'SNAPCHAT', label: 'Snapchat' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'TRIPADVISOR', label: 'Tripadvisor' },
    { value: 'ALTRO', label: 'Altro' },
  ];

  private readonly http = inject(HttpClient);
  private readonly configService = inject(ApplicationConfigService);
  private readonly menuService = inject(MenuService);

  ngOnInit(): void {
    Promise.all([this.caricaListe(), this.caricaMenu()]).finally(() => (this.isLoading = false));
  }

  async caricaListe(): Promise<void> {
    try {
      const url = this.configService.getEndpointFor('api/lista-contattis');
      this.listeContatti.set((await firstValueFrom(this.http.get<IListaContatti[]>(url))) ?? []);
    } catch (e) {
      console.error('Errore caricamento liste contatti:', e);
    }
  }

  async caricaMenu(): Promise<void> {
    try {
      const res = await firstValueFrom(this.menuService.query());
      this.menus.set(res.body ?? []);
    } catch (e) {
      console.error('Errore caricamento menu:', e);
    }
  }

  // ── Modal ──────────────────────────────────────────────────────────────────

  apriCrea(): void {
    this.formId = null;
    this.formNote = '';
    this.formMenuId = null;
    this.formItems = [];
    this.isEdit = false;
    this.erroreForm = null;
    this.modalAperta = true;
  }

  apriModifica(lista: IListaContatti): void {
    this.formId = lista.id ?? null;
    this.formNote = lista.note ?? '';
    this.formMenuId = (lista as any).menu?.id ?? null;
    this.formItems = ((lista as any).contatti ?? []).map((c: any) => ({
      id: c.id,
      tipo: c.tipo as TipoContatto,
      valore: c.valore,
      etichetta: c.etichetta,
      ordine: c.ordine,
    }));
    this.isEdit = true;
    this.erroreForm = null;
    this.modalAperta = true;
  }

  chiudiModal(): void {
    this.modalAperta = false;
    this.erroreForm = null;
  }

  aggiungiItem(): void {
    this.formItems.push({ tipo: 'TELEFONO', valore: '', ordine: this.formItems.length });
  }

  rimuoviItem(i: number): void {
    this.formItems.splice(i, 1);
    this.formItems.forEach((item, idx) => (item.ordine = idx));
  }

  spostaItem(i: number, dir: -1 | 1): void {
    const j = i + dir;
    if (j < 0 || j >= this.formItems.length) return;
    [this.formItems[i], this.formItems[j]] = [this.formItems[j], this.formItems[i]];
    this.formItems.forEach((item, idx) => (item.ordine = idx));
  }

  onTipoChange(item: ContattoItemForm): void {
    if (item.tipo !== 'SOCIAL') {
      item.reteSociale = undefined;
    }
  }

  placeholderValore(item: ContattoItemForm): string {
    switch (item.tipo) {
      case 'TELEFONO':
        return '+39 000 000 0000';
      case 'EMAIL':
        return 'info@ristorante.it';
      case 'SITO_WEB':
        return 'https://www.mioristorante.it';
      case 'SOCIAL':
        return 'https://www.instagram.com/mioprofilo';
      default:
        return '';
    }
  }

  async salva(): Promise<void> {
    this.erroreForm = null;
    for (const item of this.formItems) {
      if (!item.valore.trim()) {
        this.erroreForm = 'Tutti i campi valore sono obbligatori.';
        return;
      }
      if (item.tipo === 'SOCIAL' && !item.reteSociale) {
        this.erroreForm = 'Seleziona il social per ogni campo Social.';
        return;
      }
    }
    this.isSaving = true;
    try {
      const payload: any = {
        id: this.formId,
        note: this.formNote.trim() || null,
        menu: this.formMenuId ? { id: this.formMenuId } : null,
        contatti: this.formItems.map((item, idx) => ({
          id: item.id,
          tipo: item.tipo === 'SOCIAL' ? (item.reteSociale ?? 'SOCIAL') : item.tipo,
          valore: item.valore.trim(),
          etichetta: item.etichetta?.trim() || null,
          ordine: idx,
          lista: undefined,
        })),
      };
      const baseUrl = this.configService.getEndpointFor('api/lista-contattis');
      if (this.isEdit && this.formId) {
        await firstValueFrom(this.http.put(`${baseUrl}/${this.formId}`, payload));
      } else {
        await firstValueFrom(this.http.post(baseUrl, payload));
      }
      await this.caricaListe();
      this.chiudiModal();
    } catch (e) {
      this.erroreForm = 'Errore durante il salvataggio. Riprova.';
      console.error(e);
    } finally {
      this.isSaving = false;
    }
  }

  // ── Eliminazione ──────────────────────────────────────────────────────────

  apriEliminazione(lista: IListaContatti): void {
    this.listaInEliminazione = lista;
  }

  chiudiEliminazione(): void {
    this.listaInEliminazione = null;
  }

  async confermaEliminazione(): Promise<void> {
    if (!this.listaInEliminazione?.id) return;
    this.isDeleting = true;
    try {
      const url = this.configService.getEndpointFor(`api/lista-contattis/${this.listaInEliminazione.id}`);
      await firstValueFrom(this.http.delete(url));
      this.listeContatti.update(list => list.filter(l => l.id !== this.listaInEliminazione!.id));
      this.chiudiEliminazione();
    } catch (e) {
      console.error(e);
    } finally {
      this.isDeleting = false;
    }
  }

  // ── Helper ────────────────────────────────────────────────────────────────

  nomeMenu(id: number | null): string {
    if (!id) return '—';
    return this.menus().find(m => m.id === id)?.nome ?? String(id);
  }

  icona(tipo: string): string {
    const icons: Record<string, string> = {
      TELEFONO: 'bi-telephone-fill',
      EMAIL: 'bi-envelope-fill',
      SITO_WEB: 'bi-globe',
      SOCIAL: 'bi-share-fill',
      FACEBOOK: 'bi-facebook',
      INSTAGRAM: 'bi-instagram',
      X: 'bi-twitter-x',
      YOUTUBE: 'bi-youtube',
      TIKTOK: 'bi-tiktok',
      TELEGRAM: 'bi-telegram',
      WHATSAPP: 'bi-whatsapp',
      MESSENGER: 'bi-messenger',
    };
    return icons[tipo] ?? 'bi-link-45deg';
  }

  labelSocial(reteSociale?: string): string {
    return this.RETI_SOCIALI.find(r => r.value === reteSociale)?.label ?? reteSociale ?? 'Social';
  }
}
