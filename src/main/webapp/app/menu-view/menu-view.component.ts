// PERCORSO: src/main/webapp/app/menu-view/menu-view.component.ts
// Visualizzazione menu in stile CLASSICO (accordion "a tendina"), sola lettura.
// Usa endpoint pubblico /api/public/menu/:id (stessa fonte di menu-public).

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

interface AllergenePublic {
  id: number;
  nome: string;
  tipo: string;
  nomeDefault?: string;
}
interface ProdottoPublic {
  id: number;
  nome: string;
  descrizione?: string;
  prezzo: number;
  allergeni: AllergenePublic[];
}
interface PortataPublic {
  id: number;
  nomeVisualizzato?: string;
  nomeDefaultEnum?: string;
  ordine: number;
  prodotti: ProdottoPublic[];
}
interface MenuCompleto {
  id: number;
  nome: string;
  descrizione?: string;
  portate: PortataPublic[];
}

const PORTATA_LABELS: Record<string, string> = {
  ANTIPASTO: 'Antipasti',
  PRIMO: 'Primi Piatti',
  SECONDO: 'Secondi Piatti',
  CONTORNO: 'Contorni',
  DOLCE: 'Dolci',
  BEVANDA: 'Bevande',
  VINO_ROSSO: 'Vino Rosso',
  VINO_BIANCO: 'Vino Bianco',
  VINO_ROSATO: 'Vino Rosato',
  BIRRA: 'Birra',
  DIGESTIVO: 'Digestivi',
};

@Component({
  selector: 'jhi-menu-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.scss'],
})
export default class MenuViewComponent implements OnInit {
  menu = signal<MenuCompleto | null>(null);
  isLoading = signal(true);
  errore = signal<string | null>(null);

  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ApplicationConfigService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errore.set('Menu non trovato.');
      this.isLoading.set(false);
      return;
    }
    const url = this.configService.getEndpointFor(`api/public/menu/${id}`);
    this.http.get<MenuCompleto>(url).subscribe({
      next: data => {
        this.menu.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errore.set('Menu non trovato o non disponibile.');
        this.isLoading.set(false);
      },
    });
  }

  portataLabel(p: PortataPublic): string {
    if (p.nomeVisualizzato) return p.nomeVisualizzato;
    if (p.nomeDefaultEnum) return PORTATA_LABELS[p.nomeDefaultEnum] ?? p.nomeDefaultEnum;
    return '—';
  }

  formatPrezzo(prezzo: number): string {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(prezzo);
  }
}
