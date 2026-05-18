// PERCORSO: src/main/webapp/app/menu-public/menu-public.component.ts
// FILE NUOVO — crearlo manualmente nella cartella app/menu-public/
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  reteSociale?: string;
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
  private readonly sanitizer = inject(DomSanitizer);

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

  private readonly SOCIAL_SVG: Record<string, string> = {
    FACEBOOK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`,
    INSTAGRAM: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.225 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.856-.601-3.698-1.942-5.039C20.646.673 18.804.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
    X: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    YOUTUBE: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    TIKTOK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    WHATSAPP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
    TELEGRAM: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
    TRIPADVISOR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-5-8a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/></svg>`,
    GOOGLE: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`,
  };

  getSocialIconSvg(reteSociale: string): string | null {
    return this.SOCIAL_SVG[reteSociale] ?? null;
  }

  getSafeSocialSvg(reteSociale: string): SafeHtml {
    const svg = this.SOCIAL_SVG[reteSociale] ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
