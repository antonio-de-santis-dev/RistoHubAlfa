// PERCORSO: src/main/webapp/app/piatti-giorno/piatti-giorno-gestione.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
// ✅ FIX TS2613: named import invece di default import
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IMenu } from 'app/entities/menu/menu.model';
import { IPiattoDelGiorno } from 'app/entities/piatto-del-giorno/piatto-del-giorno.model';
// ✅ FIX TS2339: IProdotto dal modello corretto di JHipster
import { IProdotto } from 'app/entities/prodotto/prodotto.model';
import { IPortata } from 'app/entities/portata/portata.model';
import { IAllergene } from 'app/entities/allergene/allergene.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { PiattoDelGiornoService } from 'app/entities/piatto-del-giorno/service/piatto-del-giorno.service';
import { AllergeneService } from 'app/entities/allergene/service/allergene.service';

// ✅ Interfaccia locale che estende IProdotto con i campi che servono
// (il modello JHipster usa Pick<IProdotto,'id'> in alcune relazioni,
//  ma nella lista completa i campi ci sono tutti)
interface ProdottoEsteso extends IProdotto {
  nome: string;
  descrizione?: string | null;
  prezzo?: number | null;
}

@Component({
  selector: 'jhi-piatti-giorno-gestione',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './piatti-giorno-gestione.component.html',
  styleUrls: ['./piatti-giorno-gestione.component.scss'],
})
export class PiattiGiornoGestioneComponent implements OnInit {
  isLoading = true;
  isSaving = false;

  piattiGiorno = signal<IPiattoDelGiorno[]>([]);
  menus = signal<IMenu[]>([]);
  allergeniDisponibili = signal<IAllergene[]>([]);

  // Form creazione
  modaleCreazioneAperto = false;
  modalitaSelezioneProdotto = false;
  nome = '';
  descrizione = '';
  prezzo: number | null = null;
  menuNuovoPiatto: number | null = null;
  menuSelezionato: number | null = null;
  portataSelezionata: number | null = null;
  portate: IPortata[] = [];
  // ✅ FIX TS2339: usa ProdottoEsteso invece di Pick<IProdotto,'id'>
  prodotti: ProdottoEsteso[] = [];
  prodottoSelezionato: ProdottoEsteso | null = null;
  allergeniSelezionati: Set<number> = new Set();

  // Modifica
  modaleModificaAperto = false;
  piattoInModifica: IPiattoDelGiorno | null = null;
  editNome = '';
  editDescrizione = '';
  editPrezzo: number | null = null;
  editMenuId: number | null = null;
  isSavingEdit = false;
  editErrore: string | null = null;

  // Eliminazione
  modaleEliminazioneAperto = false;
  piattoInEliminazione: IPiattoDelGiorno | null = null;
  isDeleting = false;

  private readonly http = inject(HttpClient);
  private readonly configService = inject(ApplicationConfigService);
  private readonly menuService = inject(MenuService);
  private readonly piattoDelGiornoService = inject(PiattoDelGiornoService);
  private readonly allergeneService = inject(AllergeneService);

  ngOnInit(): void {
    this.caricaTutto();
  }

  async caricaTutto(): Promise<void> {
    try {
      const [menusRes, allergeniRes, piattiRes] = await Promise.all([
        firstValueFrom(this.menuService.query()),
        firstValueFrom(this.allergeneService.query()),
        firstValueFrom(this.piattoDelGiornoService.query()),
      ]);
      this.menus.set(menusRes.body ?? []);
      this.allergeniDisponibili.set(allergeniRes.body ?? []);
      this.piattiGiorno.set(piattiRes.body ?? []);
    } catch (err: unknown) {
      console.error('Errore caricamento piatti del giorno:', err);
    } finally {
      this.isLoading = false;
    }
  }

  // ── Selezione portata/prodotto ─────────────────────────────────────────────

  async onMenuSelezionato(): Promise<void> {
    if (!this.menuSelezionato) return;
    this.portate = [];
    this.prodotti = [];
    this.portataSelezionata = null;
    this.prodottoSelezionato = null;
    const url = this.configService.getEndpointFor(`api/portatas?menuId.equals=${this.menuSelezionato}`);
    try {
      // ✅ FIX TS2571: cast tipizzato
      const risultato = await firstValueFrom(this.http.get<IPortata[]>(url));
      this.portate = risultato ?? [];
    } catch (err: unknown) {
      console.error('Errore portate:', err);
    }
  }

  async onPortataSelezionata(): Promise<void> {
    if (!this.portataSelezionata) return;
    this.prodotti = [];
    this.prodottoSelezionato = null;
    const url = this.configService.getEndpointFor(`api/prodottos?portataId.equals=${this.portataSelezionata}`);
    try {
      // ✅ FIX TS2339: cast a ProdottoEsteso[] per avere nome/descrizione/prezzo
      const risultato = await firstValueFrom(this.http.get<ProdottoEsteso[]>(url));
      this.prodotti = risultato ?? [];
    } catch (err: unknown) {
      console.error('Errore prodotti:', err);
    }
  }

  // ── Modali creazione ──────────────────────────────────────────────────────

  apriModaleCrea(): void {
    this.modaleCreazioneAperto = true;
    this.modalitaSelezioneProdotto = false;
    this.resetForm();
  }

  apriModaleSelezionaProdotto(): void {
    this.modaleCreazioneAperto = true;
    this.modalitaSelezioneProdotto = true;
    this.resetForm();
  }

  chiudiModale(): void {
    this.modaleCreazioneAperto = false;
    this.resetForm();
  }

  resetForm(): void {
    this.nome = '';
    this.descrizione = '';
    this.prezzo = null;
    this.menuNuovoPiatto = null;
    this.menuSelezionato = null;
    this.portataSelezionata = null;
    this.portate = [];
    this.prodotti = [];
    this.prodottoSelezionato = null;
    this.allergeniSelezionati = new Set();
  }

  toggleAllergene(id: number): void {
    if (this.allergeniSelezionati.has(id)) this.allergeniSelezionati.delete(id);
    else this.allergeniSelezionati.add(id);
    this.allergeniSelezionati = new Set(this.allergeniSelezionati);
  }

  formValido(): boolean {
    if (this.modalitaSelezioneProdotto) return this.prodottoSelezionato !== null && this.menuSelezionato !== null;
    return !!this.nome.trim() && this.prezzo !== null && this.prezzo > 0 && this.menuNuovoPiatto !== null;
  }

  async salvaPiatto(): Promise<void> {
    if (!this.formValido()) return;
    this.isSaving = true;
    try {
      const allergeni = this.modalitaSelezioneProdotto ? [] : [...this.allergeniSelezionati].map(id => ({ id }));

      const body: any = { attivo: true };
      if (this.modalitaSelezioneProdotto && this.prodottoSelezionato) {
        body.prodotto = { id: this.prodottoSelezionato.id };
        body.menu = { id: this.menuSelezionato };
      } else {
        body.nome = this.nome.trim();
        body.descrizione = this.descrizione.trim() || null;
        body.prezzo = this.prezzo;
        body.menu = { id: this.menuNuovoPiatto };
        body.allergeni = allergeni;
      }

      const url = this.configService.getEndpointFor('api/piatto-del-giornos');
      const nuovo = await firstValueFrom(this.http.post<IPiattoDelGiorno>(url, body));
      this.piattiGiorno.update(list => [nuovo, ...list]);
      this.chiudiModale();
    } catch (err: unknown) {
      console.error('Errore salvataggio piatto:', err);
    } finally {
      this.isSaving = false;
    }
  }

  // ── Toggle attivo ─────────────────────────────────────────────────────────

  async toggleAttivo(piatto: IPiattoDelGiorno): Promise<void> {
    if (!piatto.id) return;
    const nuovoStato = !piatto.attivo;
    try {
      const url = this.configService.getEndpointFor(`api/piatto-del-giornos/${piatto.id}`);
      await firstValueFrom(this.http.patch(url, { id: piatto.id, attivo: nuovoStato }));
      this.piattiGiorno.update(list => list.map(p => (p.id === piatto.id ? { ...p, attivo: nuovoStato } : p)));
    } catch (err: unknown) {
      console.error('Errore toggle attivo:', err);
    }
  }

  // ── Modifica ──────────────────────────────────────────────────────────────

  apriModaleModifica(piatto: IPiattoDelGiorno): void {
    this.piattoInModifica = piatto;
    // ✅ FIX TS2339: accesso sicuro ai campi tramite type assertion
    const prodotto = piatto.prodotto as any;
    this.editNome = piatto.nome ?? prodotto?.nome ?? '';
    this.editDescrizione = piatto.descrizione ?? prodotto?.descrizione ?? '';
    this.editPrezzo = piatto.prezzo ?? prodotto?.prezzo ?? null;
    this.editMenuId = (piatto.menu as any)?.id ?? null;
    this.editErrore = null;
    this.modaleModificaAperto = true;
  }

  chiudiModaleModifica(): void {
    this.modaleModificaAperto = false;
    this.piattoInModifica = null;
    this.editErrore = null;
  }

  async salvaModifica(): Promise<void> {
    if (!this.piattoInModifica?.id) return;
    this.isSavingEdit = true;
    this.editErrore = null;
    try {
      const body: any = {
        id: this.piattoInModifica.id,
        attivo: this.piattoInModifica.attivo,
        menu: { id: this.editMenuId },
        nome: this.editNome.trim() || null,
        descrizione: this.editDescrizione.trim() || null,
        prezzo: this.editPrezzo,
      };
      if (this.piattoInModifica.prodotto) {
        body.prodotto = { id: (this.piattoInModifica.prodotto as any).id };
      }
      const url = this.configService.getEndpointFor(`api/piatto-del-giornos/${this.piattoInModifica.id}`);
      const aggiornato = await firstValueFrom(this.http.put<IPiattoDelGiorno>(url, body));
      this.piattiGiorno.update(list => list.map(p => (p.id === aggiornato.id ? aggiornato : p)));
      this.chiudiModaleModifica();
    } catch (err: unknown) {
      this.editErrore = 'Errore durante il salvataggio. Riprova.';
      console.error(err);
    } finally {
      this.isSavingEdit = false;
    }
  }

  // ── Eliminazione ──────────────────────────────────────────────────────────

  apriModaleEliminazione(piatto: IPiattoDelGiorno): void {
    this.piattoInEliminazione = piatto;
    this.modaleEliminazioneAperto = true;
  }

  chiudiModaleEliminazione(): void {
    this.piattoInEliminazione = null;
    this.modaleEliminazioneAperto = false;
  }

  async confermaEliminazione(): Promise<void> {
    if (!this.piattoInEliminazione?.id) return;
    this.isDeleting = true;
    try {
      await firstValueFrom(this.piattoDelGiornoService.delete(this.piattoInEliminazione.id));
      this.piattiGiorno.update(list => list.filter(p => p.id !== this.piattoInEliminazione!.id));
      this.chiudiModaleEliminazione();
    } catch (err: unknown) {
      console.error('Errore eliminazione:', err);
    } finally {
      this.isDeleting = false;
    }
  }

  // ── Helper display ────────────────────────────────────────────────────────

  nomePiatto(p: IPiattoDelGiorno): string {
    return p.nome ?? (p.prodotto as any)?.nome ?? '—';
  }

  descrizionePiatto(p: IPiattoDelGiorno): string {
    return p.descrizione ?? (p.prodotto as any)?.descrizione ?? '';
  }

  prezzoPiatto(p: IPiattoDelGiorno): number {
    return p.prezzo ?? (p.prodotto as any)?.prezzo ?? 0;
  }

  formatPrezzo(prezzo: number): string {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(prezzo);
  }

  nomeMenu(id: number | null | undefined): string {
    if (!id) return '—';
    return this.menus().find(m => m.id === id)?.nome ?? String(id);
  }

  allergeneIconUrl(a: IAllergene): string {
    if (a.tipo === 'DEFAULT' && a.nomeDefault) {
      return `/content/images/allergeni/${String(a.nomeDefault).toLowerCase()}.png`;
    }
    return '/content/images/allergeni/custom.png';
  }
}
