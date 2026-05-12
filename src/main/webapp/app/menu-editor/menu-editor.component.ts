import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import SharedModule from 'app/shared/shared.module';
import { IMenu } from 'app/entities/menu/menu.model';
import { IPortata } from 'app/entities/portata/portata.model';
import { IProdotto } from 'app/entities/prodotto/prodotto.model';
import { IAllergene } from 'app/entities/allergene/allergene.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { PortataService } from 'app/entities/portata/service/portata.service';
import { ProdottoService } from 'app/entities/prodotto/service/prodotto.service';
import { AllergeneService } from 'app/entities/allergene/service/allergene.service';
import ApplicationConfigService from 'app/core/config/application-config.service';

/**
 * Percorso: src/main/webapp/app/menu-editor/menu-editor.component.ts
 * → FILE NUOVO da creare in src/main/webapp/app/menu-editor/
 *
 * Route: /menu-editor/:id
 * Visualizza il menu in accordion Bootstrap 5 con gestione prodotti.
 */
@Component({
  selector: 'jhi-menu-editor',
  templateUrl: './menu-editor.component.html',
  styleUrl: './menu-editor.component.scss',
  imports: [SharedModule, RouterModule, FormsModule],
})
export default class MenuEditorComponent implements OnInit {
  menu = signal<IMenu | null>(null);
  portate = signal<IPortata[]>([]);
  prodottiPerPortata = signal<Map<number, IProdotto[]>>(new Map());
  allergeniDisponibili = signal<IAllergene[]>([]);
  isLoading = signal(true);

  // Modal prodotto
  showModalProdotto = signal(false);
  portataSelezionata = signal<IPortata | null>(null);
  prodottoInEdit = signal<Partial<IProdotto> | null>(null);
  allergeniSelezionati = signal<number[]>([]);
  tabModal = signal<'manuale' | 'pdf'>('manuale');
  pdfFile = signal<File | null>(null);
  pdfPreview = signal<any[]>([]);
  salvataggioInCorso = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);
  private readonly portataService = inject(PortataService);
  private readonly prodottoService = inject(ProdottoService);
  private readonly allergeneService = inject(AllergeneService);
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaMenu(id);
    this.caricaAllergeni();
  }

  caricaMenu(id: number): void {
    this.menuService.find(id).subscribe(res => {
      this.menu.set(res.body);
      this.caricaPortate(id);
    });
  }

  caricaPortate(menuId: number): void {
    this.portataService.query({ 'menuId.equals': menuId }).subscribe(res => {
      const portateOrdinate = (res.body ?? []).sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0));
      this.portate.set(portateOrdinate);
      portateOrdinate.forEach(p => this.caricaProdotti(p.id!));
      this.isLoading.set(false);
    });
  }

  caricaProdotti(portataId: number): void {
    this.prodottoService.query({ 'portataId.equals': portataId }).subscribe(res => {
      const mappa = new Map(this.prodottiPerPortata());
      mappa.set(portataId, res.body ?? []);
      this.prodottiPerPortata.set(mappa);
    });
  }

  caricaAllergeni(): void {
    this.allergeneService.query().subscribe(res => this.allergeniDisponibili.set(res.body ?? []));
  }

  getProdotti(portataId: number): IProdotto[] {
    return this.prodottiPerPortata().get(portataId) ?? [];
  }

  getNomePortata(portata: IPortata): string {
    if (portata.nomePersonalizzato) return portata.nomePersonalizzato;
    const nomiDefault: Record<string, string> = {
      ANTIPASTO: 'Antipasti',
      PRIMO: 'Primi',
      SECONDO: 'Secondi',
      CONTORNO: 'Contorni',
      DOLCE: 'Dolci',
      BEVANDA: 'Bevande',
      VINO_ROSSO: 'Vini Rossi',
      VINO_BIANCO: 'Vini Bianchi',
      VINO_ROSATO: 'Vini Rosati',
      BIRRA: 'Birre',
      DIGESTIVO: 'Digestivi',
    };
    return nomiDefault[portata.nomeDefault as string] ?? String(portata.nomeDefault);
  }

  // ── Modal prodotto ──────────────────────────────────────────────────────

  apriModalNuovoProdotto(portata: IPortata): void {
    this.portataSelezionata.set(portata);
    this.prodottoInEdit.set({ nome: '', descrizione: '', prezzo: undefined, visibile: true });
    this.allergeniSelezionati.set([]);
    this.tabModal.set('manuale');
    this.pdfPreview.set([]);
    this.showModalProdotto.set(true);
  }

  apriModalModificaProdotto(prodotto: IProdotto, portata: IPortata): void {
    this.portataSelezionata.set(portata);
    this.prodottoInEdit.set({ ...prodotto });
    this.allergeniSelezionati.set((prodotto.allergeni ?? []).map(a => a.id!));
    this.tabModal.set('manuale');
    this.showModalProdotto.set(true);
  }

  chiudiModal(): void {
    this.showModalProdotto.set(false);
    this.prodottoInEdit.set(null);
  }

  isAllergeneSelezionato(id: number): boolean {
    return this.allergeniSelezionati().includes(id);
  }

  toggleAllergene(id: number): void {
    const attuale = this.allergeniSelezionati();
    if (attuale.includes(id)) {
      this.allergeniSelezionati.set(attuale.filter(a => a !== id));
    } else {
      this.allergeniSelezionati.set([...attuale, id]);
    }
  }

  salvaProdotto(): void {
    const prodotto = this.prodottoInEdit();
    const portata = this.portataSelezionata();
    if (!prodotto || !portata) return;

    this.salvataggioInCorso.set(true);
    const allergeni = this.allergeniSelezionati().map(id => ({ id }));
    const payload: IProdotto = {
      ...prodotto,
      portata: { id: portata.id },
      allergeni,
    } as IProdotto;

    const op$ = prodotto.id ? this.prodottoService.update(payload) : this.prodottoService.create(payload);

    op$.subscribe({
      next: () => {
        this.caricaProdotti(portata.id!);
        this.chiudiModal();
        this.salvataggioInCorso.set(false);
      },
      error: () => this.salvataggioInCorso.set(false),
    });
  }

  toggleVisibilita(prodotto: IProdotto): void {
    this.prodottoService.partialUpdate({ id: prodotto.id, visibile: !prodotto.visibile }).subscribe(() => {
      this.caricaProdotti(prodotto.portata?.id!);
    });
  }

  eliminaProdotto(prodotto: IProdotto): void {
    if (!confirm(`Eliminare "${prodotto.nome}"?`)) return;
    this.prodottoService.delete(prodotto.id!).subscribe(() => {
      this.caricaProdotti(prodotto.portata?.id!);
    });
  }

  // ── Import PDF ──────────────────────────────────────────────────────────

  onPdfSelezionato(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.pdfFile.set(input.files[0]);
  }

  inviaImportPdf(): void {
    const file = this.pdfFile();
    const portata = this.portataSelezionata();
    if (!file || !portata) return;

    const formData = new FormData();
    formData.append('file', file);

    const url = this.applicationConfigService.getEndpointFor(`/api/prodotti/import-pdf?portataId=${portata.id}`);
    this.http.post<any[]>(url, formData).subscribe({
      next: prodotti => this.pdfPreview.set(prodotti),
      error: () => alert("Errore durante l'elaborazione del PDF."),
    });
  }

  confermaPdfImport(): void {
    const portata = this.portataSelezionata();
    if (!portata) return;
    this.salvataggioInCorso.set(true);
    const operazioni = this.pdfPreview().map(p =>
      this.prodottoService.create({ ...p, portata: { id: portata.id }, visibile: true, allergeni: [] } as IProdotto),
    );
    let completati = 0;
    operazioni.forEach(op =>
      op.subscribe(() => {
        completati++;
        if (completati === operazioni.length) {
          this.caricaProdotti(portata.id!);
          this.chiudiModal();
          this.salvataggioInCorso.set(false);
        }
      }),
    );
  }

  tornaAllaMappa(): void {
    this.router.navigate(['/']);
  }
}
