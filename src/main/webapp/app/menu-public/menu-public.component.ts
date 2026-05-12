// PERCORSO: src/main/webapp/app/menu-public/menu-public.component.ts
// FILE NUOVO — crearlo manualmente nella cartella app/menu-public/
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

// Interfacce locali per il DTO pubblico
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
interface PiattoGiornoPublic {
  id: number;
  attivo: boolean;
  nome?: string;
  descrizione?: string;
  prezzo?: number;
  allergeni: AllergenePublic[];
}
interface ContattoPublic {
  id: number;
  tipo: string;
  valore: string;
  etichetta?: string;
  ordine: number;
}
interface ListaContattiPublic {
  note?: string;
  contatti: ContattoPublic[];
}
interface MenuCompleto {
  id: number;
  nome: string;
  descrizione?: string;
  portate: PortataPublic[];
  piattiDelGiorno: PiattoGiornoPublic[];
  contatti?: ListaContattiPublic;
}

// Etichette italiane per le portate default
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
  selector: 'app-menu-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-public.component.html',
  styleUrl: './menu-public.component.scss',
})
export default class MenuPublicComponent implements OnInit {
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

  portataLabel(portata: PortataPublic): string {
    if (portata.nomeVisualizzato) return portata.nomeVisualizzato;
    if (portata.nomeDefaultEnum) return PORTATA_LABELS[portata.nomeDefaultEnum] ?? portata.nomeDefaultEnum;
    return '—';
  }

  allergeneIconUrl(a: AllergenePublic): string {
    if (a.tipo === 'DEFAULT' && a.nomeDefault) {
      return `/assets/images/allergeni/${a.nomeDefault.toLowerCase()}.png`;
    }
    return '/assets/images/allergeni/custom.png';
  }

  contattoIcon(tipo: string): string {
    const icons: Record<string, string> = {
      TELEFONO: 'bi-telephone-fill',
      EMAIL: 'bi-envelope-fill',
      SITO_WEB: 'bi-globe',
      FACEBOOK: 'bi-facebook',
      INSTAGRAM: 'bi-instagram',
      X: 'bi-twitter-x',
      YOUTUBE: 'bi-youtube',
      TIKTOK: 'bi-tiktok',
      TELEGRAM: 'bi-telegram',
      WHATSAPP: 'bi-whatsapp',
      MESSENGER: 'bi-messenger',
      GOOGLE: 'bi-google',
      TRIPADVISOR: 'bi-map',
      THREADS: 'bi-threads',
      SNAPCHAT: 'bi-snapchat',
    };
    return icons[tipo] ?? 'bi-link-45deg';
  }

  contattoHref(c: ContattoPublic): string {
    switch (c.tipo) {
      case 'TELEFONO':
        return `tel:${c.valore}`;
      case 'EMAIL':
        return `mailto:${c.valore}`;
      default:
        return c.valore.startsWith('http') ? c.valore : `https://${c.valore}`;
    }
  }

  formatPrezzo(prezzo: number): string {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(prezzo);
  }

  // Raccoglie tutti gli allergeni unici nel menu
  getAllergeniMenu(): AllergenePublic[] {
    const m = this.menu();
    if (!m) return [];
    const map = new Map<number, AllergenePublic>();
    m.portate.forEach(p => p.prodotti.forEach(pr => pr.allergeni.forEach(a => map.set(a.id, a))));
    m.piattiDelGiorno.forEach(p => p.allergeni.forEach(a => map.set(a.id, a)));
    return [...map.values()].sort((a, b) => a.nome.localeCompare(b.nome));
  }
}
