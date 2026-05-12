// PERCORSO: src/main/webapp/app/menu-editor/menu-editor.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import SharedModule from 'app/shared/shared.module';
import { IMenu } from 'app/entities/menu/menu.model';
import { IPortata } from 'app/entities/portata/portata.model';
import { IProdotto, NewProdotto } from 'app/entities/prodotto/prodotto.model';
import { IAllergene } from 'app/entities/allergene/allergene.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { PortataService } from 'app/entities/portata/service/portata.service';
import { ProdottoService } from 'app/entities/prodotto/service/prodotto.service';
import { AllergeneService } from 'app/entities/allergene/service/allergene.service';
// ✅ FIX TS2613: named import invece di default import
import { ApplicationConfigService } from 'app/core/config/application-config.service';

// ✅ Interfaccia locale per il form prodotto che evita il conflitto tra
//    IProdotto (id: number) e NewProdotto (id: null)
interface ProdottoForm {
  id?: number | null;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  visibile?: boolean | null;
  portata?: { id: number } | null;
  // ✅ FIX TS2551: il modello JHipster usa 'allergenis' (plurale con s)
  allergenis?: Pick<IAllergene, 'id'>[] | null;
}

/**
 * Percorso: src/main/webapp/app/menu-editor/menu-editor.component.ts
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

  // Modal prodotto — usa ProdottoForm invece di Partial<IProdotto>
  showModalProdotto = signal(false);
  portataSelezionata = signal<IPortata | null>(null);
  prodottoInEdit = signal<ProdottoForm | null>(null);
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
      portateOrdinate.forEach(p => {
        if (p.id != null) this.caricaProdotti(p.id);
      });
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
    // Nuovo prodotto: id è null (NewProdotto), usiamo ProdottoForm
    const nuovoProdotto: ProdottoForm = {
      id: null,
      nome: '',
      descrizione: '',
      prezzo: undefined,
      visibile: true,
      allergenis: [],
    };
    this.prodottoInEdit.set(nuovoProdotto);
    this.allergeniSelezionati.set([]);
    this.tabModal.set('manuale');
    this.pdfPreview.set([]);
    this.showModalProdotto.set(true);
  }

  apriModalModificaProdotto(prodotto: IProdotto, portata: IPortata): void {
    this.portataSelezionata.set(portata);
    // Modifica: id è number, usiamo ProdottoForm
    const form: ProdottoForm = {
      id: prodotto.id,
      nome: prodotto.nome,
      descrizione: prodotto.descrizione,
      prezzo: prodotto.prezzo,
      visibile: prodotto.visibile,
      portata: prodotto.portata,
      // ✅ FIX TS2551: legge allergenis (non allergeni)
      allergenis: prodotto.allergenis ?? [],
    };
    this.prodottoInEdit.set(form);
    // ✅ FIX TS7006: tipo esplicito per 'a'
    this.allergeniSelezionati.set((prodotto.allergenis ?? []).map((a: Pick<IAllergene, 'id'>) => a.id));
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
      this.allergeniSelezionati.set(attuale.filter((a: number) => a !== id));
    } else {
      this.allergeniSelezionati.set([...attuale, id]);
    }
  }

  salvaProdotto(): void {
    const prodottoForm = this.prodottoInEdit();
    const portata = this.portataSelezionata();
    if (!prodottoForm || !portata || portata.id == null) return;

    this.salvataggioInCorso.set(true);
    // ✅ FIX TS2345: distinguiamo esplicitamente nuovo (NewProdotto) da esistente (IProdotto)
    const allergenis = this.allergeniSelezionati().map(id => ({ id }));

    if (prodottoForm.id != null) {
      // Modifica: IProdotto (id è number)
      const payload: IProdotto = {
        id: prodottoForm.id,
        nome: prodottoForm.nome,
        descrizione: prodottoForm.descrizione,
        prezzo: prodottoForm.prezzo,
        visibile: prodottoForm.visibile ?? true,
        portata: { id: portata.id },
        allergenis,
      };
      this.prodottoService.update(payload).subscribe({
        next: () => {
          this.caricaProdotti(portata.id!);
          this.chiudiModal();
          this.salvataggioInCorso.set(false);
        },
        error: () => this.salvataggioInCorso.set(false),
      });
    } else {
      // Nuovo: NewProdotto (id è null)
      const payload: NewProdotto = {
        id: null,
        nome: prodottoForm.nome,
        descrizione: prodottoForm.descrizione,
        prezzo: prodottoForm.prezzo,
        visibile: prodottoForm.visibile ?? true,
        portata: { id: portata.id },
        allergenis,
      };
      this.prodottoService.create(payload).subscribe({
        next: () => {
          this.caricaProdotti(portata.id!);
          this.chiudiModal();
          this.salvataggioInCorso.set(false);
        },
        error: () => this.salvataggioInCorso.set(false),
      });
    }
  }

  toggleVisibilita(prodotto: IProdotto): void {
    if (prodotto.portata?.id == null) return;
    const portataId = prodotto.portata.id;
    this.prodottoService.partialUpdate({ id: prodotto.id, visibile: !prodotto.visibile }).subscribe(() => {
      this.caricaProdotti(portataId);
    });
  }

  eliminaProdotto(prodotto: IProdotto): void {
    if (!confirm(`Eliminare "${prodotto.nome}"?`)) return;
    if (prodotto.portata?.id == null) return;
    const portataId = prodotto.portata.id;
    this.prodottoService.delete(prodotto.id).subscribe(() => {
      this.caricaProdotti(portataId);
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
    if (!file || !portata || portata.id == null) return;

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
    if (!portata || portata.id == null) return;
    this.salvataggioInCorso.set(true);
    const portataId = portata.id;
    const operazioni = this.pdfPreview().map(p => {
      // ✅ FIX TS2345: creo esplicitamente un NewProdotto (id: null)
      const nuovoProdotto: NewProdotto = {
        id: null,
        nome: p.nome,
        descrizione: p.descrizione,
        prezzo: p.prezzo,
        visibile: true,
        portata: { id: portataId },
        allergenis: [],
      };
      return this.prodottoService.create(nuovoProdotto);
    });
    let completati = 0;
    operazioni.forEach(op =>
      op.subscribe(() => {
        completati++;
        if (completati === operazioni.length) {
          this.caricaProdotti(portataId);
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
