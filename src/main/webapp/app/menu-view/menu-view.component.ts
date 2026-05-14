// PERCORSO: src/main/webapp/app/menu-view/menu-view.component.ts
// Visualizzazione menu in stile CLASSICO (accordion a tendina) per il ristoratore.
// Permette di vedere, modificare ed eliminare prodotti.

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

// ── Interfacce locali (allineate agli endpoint JHipster di Alfa) ──

export interface MenuView {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  attivo?: boolean | null;
  logo?: string | null;
  logoContentType?: string | null;
}

export interface AllergeneView {
  id: number;
  nome?: string | null;
  tipo?: string | null;
  nomeDefault?: string | null;
  icona?: string | null;
  colore?: string | null;
}

export interface ProdottoView {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  visibile?: boolean | null;
  portata?: { id: number } | null;
  allergenis?: AllergeneView[] | null;
}

export interface PortataView {
  id: number;
  tipo?: string | null;
  nomeDefault?: string | null;
  nomePersonalizzato?: string | null;
  ordine?: number | null;
  menu?: { id: number } | null;
  // proprietà locali di UI
  prodotti?: ProdottoView[];
  aperta?: boolean;
}

export interface PiattoDelGiornoView {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  attivo?: boolean | null;
  prodotto?: ProdottoView | null;
  allergenis?: AllergeneView[] | null;
}

// Mappa nomi portate default → italiano
const NOMI_IT: Record<string, string> = {
  ANTIPASTO: '🥗 Antipasto',
  PRIMO: '🍝 Primo',
  SECONDO: '🥩 Secondo',
  CONTORNO: '🥦 Contorno',
  BEVANDA: '🥤 Bevande',
  BIRRA: '🍺 Birre',
  VINO_ROSSO: '🍷 Vino Rosso',
  VINO_ROSATO: '🌹 Vino Rosato',
  VINO_BIANCO: '🍾 Vino Bianco',
  DOLCE: '🍮 Dolci',
  DIGESTIVO: '🫙 Digestivi',
};

const ORDINE_PORTATE: Record<string, number> = {
  ANTIPASTO: 1,
  PRIMO: 2,
  SECONDO: 3,
  CONTORNO: 4,
  BEVANDA: 5,
  BIRRA: 6,
  VINO_ROSSO: 7,
  VINO_ROSATO: 8,
  VINO_BIANCO: 9,
  DOLCE: 10,
  DIGESTIVO: 11,
};

@Component({
  selector: 'jhi-menu-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuViewComponent implements OnInit {
  menu: MenuView | null = null;
  portate: PortataView[] = [];
  logoUrl: SafeUrl | null = null;
  piattiDelGiorno: PiattoDelGiornoView[] = [];
  allergeniDisponibili: AllergeneView[] = [];

  isLoading = true;
  errore = false;
  piattiGiornoAperti = false;
  allergeniMenuAperti = false;

  // ── Modifica prodotto ──────────────────────────────────────────
  prodottoInModifica: ProdottoView | null = null;
  editNome = '';
  editDescrizione = '';
  editPrezzo: number | null = null;
  editVisibile = true;
  editAllergeniSelezionati: Set<number> = new Set();
  isSavingEdit = false;
  editErrore: string | null = null;

  // ── Elimina prodotto ───────────────────────────────────────────
  prodottoInEliminazione: ProdottoView | null = null;
  isDeleting = false;

  // ── Toast ──────────────────────────────────────────────────────
  toastMsg: string | null = null;
  toastTipo: 'success' | 'error' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errore = true;
      this.isLoading = false;
      return;
    }
    this.caricaDati(id);
  }

  // ── Caricamento dati ──────────────────────────────────────────

  async caricaDati(id: string): Promise<void> {
    try {
      // Carica menu, portate, allergeni e piatti del giorno in parallelo
      const [menu, portateRaw, allergeni, piattiRaw] = await Promise.all([
        firstValueFrom(this.http.get<MenuView>(`/api/menus/${id}`)),
        firstValueFrom(this.http.get<PortataView[]>(`/api/portatas?menuId.equals=${id}&size=100`)),
        firstValueFrom(this.http.get<AllergeneView[]>('/api/allergenes?size=200')),
        firstValueFrom(this.http.get<PiattoDelGiornoView[]>(`/api/piatto-del-gionos?menuId.equals=${id}&attivo.equals=true&size=50`)),
      ]);

      this.menu = menu;
      this.allergeniDisponibili = allergeni ?? [];
      this.piattiDelGiorno = piattiRaw ?? [];

      // Logo
      if (menu?.logo && menu?.logoContentType) {
        const dataUrl = `data:${menu.logoContentType};base64,${menu.logo}`;
        this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
      }

      // Carica prodotti per ogni portata in parallelo
      const portateConProdotti = await Promise.all(
        (portateRaw ?? []).map(async portata => {
          const prodotti = await firstValueFrom(this.http.get<ProdottoView[]>(`/api/prodottos?portataId.equals=${portata.id}&size=200`));
          return { ...portata, prodotti: prodotti ?? [], aperta: false };
        }),
      );

      this.portate = this.ordinaPortate(portateConProdotti);
    } catch (err) {
      console.error('Errore caricamento menu:', err);
      this.errore = true;
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  // ── Ordinamento portate ───────────────────────────────────────

  private ordinaPortate(portate: PortataView[]): PortataView[] {
    return [...portate].sort((a, b) => {
      if (a.tipo === 'DEFAULT' && b.tipo === 'DEFAULT') {
        return (ORDINE_PORTATE[a.nomeDefault ?? ''] ?? 99) - (ORDINE_PORTATE[b.nomeDefault ?? ''] ?? 99);
      }
      if (a.tipo === 'DEFAULT') return -1;
      if (b.tipo === 'DEFAULT') return 1;
      return (a.ordine ?? 99) - (b.ordine ?? 99);
    });
  }

  // ── Helpers display ───────────────────────────────────────────

  nomePortata(p: PortataView): string {
    if (p.tipo === 'PERSONALIZZATA' && p.nomePersonalizzato) return p.nomePersonalizzato;
    return NOMI_IT[p.nomeDefault ?? ''] ?? (p.nomeDefault ?? '').replace(/_/g, ' ');
  }

  formatPrezzo(p: number | null | undefined): string {
    if (p == null) return '';
    return `€ ${p.toFixed(2).replace('.', ',')}`;
  }

  // Allergene: SVG incorporato o colore
  getAllergeneIconPath(a: AllergeneView): string | null {
    if (a.nomeDefault && a.nomeDefault !== 'PERSONALIZZATO') {
      return `/content/images/allergeni/${a.nomeDefault.toLowerCase()}.svg`;
    }
    return null;
  }

  get tuttiAllergeniMenu(): AllergeneView[] {
    const map = new Map<number, AllergeneView>();
    this.portate.forEach(portata => (portata.prodotti ?? []).forEach(prod => (prod.allergenis ?? []).forEach(a => map.set(a.id, a))));
    return Array.from(map.values());
  }

  // ── Toggle portata accordion ──────────────────────────────────

  togglePortata(portata: PortataView): void {
    portata.aperta = !portata.aperta;
    this.cdr.markForCheck();
  }

  togglePiattiGiorno(): void {
    this.piattiGiornoAperti = !this.piattiGiornoAperti;
    this.cdr.markForCheck();
  }

  toggleAllergeniMenu(): void {
    this.allergeniMenuAperti = !this.allergeniMenuAperti;
    this.cdr.markForCheck();
  }

  // ── Visibilità prodotto (toggle rapido) ───────────────────────

  async toggleVisibile(prodotto: ProdottoView, portata: PortataView): Promise<void> {
    const nuovoStato = !prodotto.visibile;
    const vecchio = prodotto.visibile;
    prodotto.visibile = nuovoStato; // ottimistico
    this.cdr.markForCheck();
    try {
      await firstValueFrom(this.http.patch(`/api/prodottos/${prodotto.id}`, { id: prodotto.id, visibile: nuovoStato }));
      this.mostraToast(nuovoStato ? '✅ Prodotto reso visibile' : '🔒 Prodotto nascosto', 'success');
    } catch {
      prodotto.visibile = vecchio; // rollback
      this.cdr.markForCheck();
      this.mostraToast('❌ Errore aggiornamento visibilità', 'error');
    }
  }

  // ── Modifica prodotto ─────────────────────────────────────────

  apriModifica(prodotto: ProdottoView): void {
    this.prodottoInModifica = prodotto;
    this.editNome = prodotto.nome ?? '';
    this.editDescrizione = prodotto.descrizione ?? '';
    this.editPrezzo = prodotto.prezzo ?? null;
    this.editVisibile = prodotto.visibile ?? true;
    this.editAllergeniSelezionati = new Set((prodotto.allergenis ?? []).map(a => a.id));
    this.editErrore = null;
    this.cdr.markForCheck();
  }

  chiudiModifica(): void {
    this.prodottoInModifica = null;
    this.editErrore = null;
    this.cdr.markForCheck();
  }

  toggleEditAllergene(id: number): void {
    if (this.editAllergeniSelezionati.has(id)) this.editAllergeniSelezionati.delete(id);
    else this.editAllergeniSelezionati.add(id);
    this.editAllergeniSelezionati = new Set(this.editAllergeniSelezionati);
    this.cdr.markForCheck();
  }

  async salvaModifica(): Promise<void> {
    if (!this.prodottoInModifica) return;
    if (!this.editNome.trim()) {
      this.editErrore = 'Il nome è obbligatorio.';
      return;
    }
    if (!this.editPrezzo || this.editPrezzo <= 0) {
      this.editErrore = 'Il prezzo deve essere maggiore di zero.';
      return;
    }

    this.isSavingEdit = true;
    this.editErrore = null;

    try {
      const allergenis = Array.from(this.editAllergeniSelezionati).map(id => ({ id }));
      const body = {
        id: this.prodottoInModifica.id,
        nome: this.editNome.trim(),
        descrizione: this.editDescrizione.trim() || null,
        prezzo: this.editPrezzo,
        visibile: this.editVisibile,
        portata: this.prodottoInModifica.portata,
        allergenis,
      };
      const aggiornato = await firstValueFrom(this.http.put<ProdottoView>(`/api/prodottos/${this.prodottoInModifica.id}`, body));

      // Arricchisce con gli oggetti allergeni completi
      aggiornato.allergenis = allergenis
        .map(a => this.allergeniDisponibili.find(al => al.id === a.id))
        .filter((a): a is AllergeneView => !!a);

      // Aggiorna la lista prodotti nella portata corretta
      this.portate = this.portate.map(portata => ({
        ...portata,
        prodotti: (portata.prodotti ?? []).map(p => (p.id === aggiornato.id ? { ...aggiornato } : p)),
      }));

      this.chiudiModifica();
      this.mostraToast('✅ Prodotto aggiornato', 'success');
    } catch (err) {
      console.error('Errore salvataggio:', err);
      this.editErrore = 'Errore durante il salvataggio. Riprova.';
    } finally {
      this.isSavingEdit = false;
      this.cdr.markForCheck();
    }
  }

  // ── Elimina prodotto ──────────────────────────────────────────

  apriConfermaEliminazione(prodotto: ProdottoView): void {
    this.prodottoInEliminazione = prodotto;
    this.cdr.markForCheck();
  }

  chiudiConfermaEliminazione(): void {
    this.prodottoInEliminazione = null;
    this.cdr.markForCheck();
  }

  async confermanEliminazione(): Promise<void> {
    if (!this.prodottoInEliminazione) return;
    this.isDeleting = true;
    const idDaEliminare = this.prodottoInEliminazione.id;
    try {
      await firstValueFrom(this.http.delete(`/api/prodottos/${idDaEliminare}`));
      this.portate = this.portate.map(portata => ({
        ...portata,
        prodotti: (portata.prodotti ?? []).filter(p => p.id !== idDaEliminare),
      }));
      this.chiudiConfermaEliminazione();
      this.mostraToast('🗑️ Prodotto eliminato', 'success');
    } catch (err) {
      console.error('Errore eliminazione:', err);
      this.mostraToast('❌ Errore eliminazione', 'error');
    } finally {
      this.isDeleting = false;
      this.cdr.markForCheck();
    }
  }

  // ── Navigazione ───────────────────────────────────────────────

  tornaHome(): void {
    this.router.navigate(['/home']);
  }

  vaiAdAggiungiProdotto(portataId: number): void {
    this.router.navigate(['/prodotto/new'], { queryParams: { portataId } });
  }

  // ── Toast ─────────────────────────────────────────────────────

  private mostraToast(msg: string, tipo: 'success' | 'error'): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMsg = msg;
    this.toastTipo = tipo;
    this.cdr.markForCheck();
    this.toastTimer = setTimeout(() => {
      this.toastMsg = null;
      this.cdr.markForCheck();
    }, 3200);
  }

  get qrUrl(): string {
    return `${window.location.origin}/menu-public/${this.menu?.id}`;
  }

  get qrImageUrl(): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(this.qrUrl)}`;
  }

  qrVisible = false;
  mostraQr(): void {
    this.qrVisible = true;
    this.cdr.markForCheck();
  }
  chiudiQr(): void {
    this.qrVisible = false;
    this.cdr.markForCheck();
  }
}
