// PERCORSO: src/main/webapp/app/menu-view/menu-view.component.ts
// Visualizzazione menu in stile CLASSICO/MODERNO/RUSTICO con colori e font dal wizard.

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

export interface MenuView {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  attivo?: boolean | null;
  logo?: string | null;
  logoContentType?: string | null;
  colorePrimario?: string | null;
  coloreSecondario?: string | null;
  fontMenu?: string | null;
  templateStyle?: string | null;
  immagini?: string[] | null;
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

// ── Interfacce contatti ─────────────────────────────────────────
interface ContattoView {
  id?: number;
  tipo?: string;
  valore?: string;
  etichetta?: string;
  ordine?: number;
  reteSociale?: string;
}

interface ListaContattiView {
  nome?: string;
  note?: string;
  contatti: ContattoView[];
}

// ── Interfaccia lingua ──────────────────────────────────────────
interface LinguaInfo {
  codice: string;
  nome: string;
  svgBandiera: string;
}

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

// Colori e font di default se il menu non ne ha (menu creati prima del wizard)
const DEFAULT_COLORE_PRIMARIO = '#C8102E';
const DEFAULT_COLORE_SECONDARIO = '#F5E6C8';
const DEFAULT_FONT = 'Playfair Display';

// ── UI labels per multilingua ──────────────────────────────────
const UI_LABELS: Record<string, Record<string, string>> = {
  it: {
    PIATTI_GIORNO: '⭐ Piatti del Giorno',
    PIATTI_GIORNO_SHORT: 'Piatti del Giorno',
    PIATTI_PAROLA: 'piatti',
    NESSUN_PIATTO: 'Nessun piatto in questa portata.',
    ALLERGENI_TITOLO: 'Allergeni presenti',
    ALLERGENI_NOTA: '⚠️ Per info su allergeni e intolleranze, rivolgiti al personale.',
    SELEZIONA_PORTATA: 'Seleziona una portata dal menu qui sopra',
    TORNA_HOME: '← Torna',
    TORNA_FOTO: '← Galleria foto',
    AGGIUNGI_PIATTO: '+ Aggiungi piatto',
  },
};

// ── Lingue disponibili ─────────────────────────────────────────
const LINGUE_DISPONIBILI: LinguaInfo[] = [
  {
    codice: 'it',
    nome: 'Italiano',
    svgBandiera:
      '<svg viewBox="0 0 32 24"><rect width="11" height="24" fill="#009246"/><rect x="11" width="10" height="24" fill="#fff"/><rect x="21" width="11" height="24" fill="#CE2B37"/></svg>',
  },
  {
    codice: 'en',
    nome: 'English',
    svgBandiera:
      '<svg viewBox="0 0 32 24"><rect width="32" height="24" fill="#012169"/><path d="M0 0L32 24M32 0L0 24" stroke="#fff" stroke-width="4"/><path d="M0 0L32 24M32 0L0 24" stroke="#C8102E" stroke-width="2"/><path d="M16 0v24M0 12h32" stroke="#fff" stroke-width="6"/><path d="M16 0v24M0 12h32" stroke="#C8102E" stroke-width="3"/></svg>',
  },
  {
    codice: 'fr',
    nome: 'Français',
    svgBandiera:
      '<svg viewBox="0 0 32 24"><rect width="11" height="24" fill="#002395"/><rect x="11" width="10" height="24" fill="#fff"/><rect x="21" width="11" height="24" fill="#ED2939"/></svg>',
  },
  {
    codice: 'de',
    nome: 'Deutsch',
    svgBandiera:
      '<svg viewBox="0 0 32 24"><rect width="32" height="8" fill="#000"/><rect y="8" width="32" height="8" fill="#D00"/><rect y="16" width="32" height="8" fill="#FFCE00"/></svg>',
  },
  {
    codice: 'es',
    nome: 'Español',
    svgBandiera:
      '<svg viewBox="0 0 32 24"><rect width="32" height="6" fill="#AA151B"/><rect y="6" width="32" height="12" fill="#F1BF00"/><rect y="18" width="32" height="6" fill="#AA151B"/></svg>',
  },
];

// ── Social icon SVGs ────────────────────────────────────────────
const SOCIAL_ICONS: Record<string, string> = {
  FACEBOOK:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  INSTAGRAM:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
  TWITTER:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
  WHATSAPP:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  TIKTOK:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
};

@Component({
  selector: 'jhi-menu-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuViewComponent implements OnInit, OnDestroy {
  menu: MenuView | null = null;
  portate: PortataView[] = [];
  logoUrl: SafeUrl | null = null;
  piattiDelGiorno: PiattoDelGiornoView[] = [];
  allergeniDisponibili: AllergeneView[] = [];

  isLoading = true;
  errore = false;
  piattiGiornoAperti = false;
  allergeniMenuAperti = false;

  // ── Template style helpers ────────────────────────────────────
  get isModerno(): boolean {
    return this.menu?.templateStyle === 'MODERNO';
  }
  get isRustico(): boolean {
    return this.menu?.templateStyle === 'RUSTICO';
  }
  get fontTesto(): string {
    return this.fontMenu + ', serif';
  }

  // ── Lingua / Traduzione ───────────────────────────────────────
  LINGUE: LinguaInfo[] = LINGUE_DISPONIBILI;
  linguaCorrente = 'it';
  mostraDropdownLingua = false;
  isTraducendo = false;
  erroreTraduzioneVisible = false;
  private traduzioniCache: Record<string, Record<string, string>> = {};

  get linguaAttuale(): LinguaInfo {
    return this.LINGUE.find(l => l.codice === this.linguaCorrente) ?? this.LINGUE[0];
  }

  // ── Contatti ──────────────────────────────────────────────────
  listeContatti: ListaContattiView[] = [];

  // ── Moderno state ─────────────────────────────────────────────
  modernoTabAttiva: string | number | null = null;
  modernoPortataAttiva: PortataView | null = null;
  modernoCarouselIndex = 0;
  modernoImmagini: string[] = [];
  modernoImmaginiCaricate: boolean[] = [];

  // ── Rustico state ─────────────────────────────────────────────
  rusticoTabAttiva: string | number | null = null;
  rusticoPortataAttiva: PortataView | null = null;
  rusticoCarouselIndex = 0;
  rusticoImmagini: string[] = [];
  rusticoImmaginiCaricate: boolean[] = [];

  // ── Carousel autoplay ─────────────────────────────────────────
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private touchStartX = 0;

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

  // ── Aggiungi prodotto inline ──────────────────────────────────
  portataPerAggiunta: PortataView | null = null;
  addNome = '';
  addDescrizione = '';
  addPrezzo: number | null = null;
  addVisibile = true;
  addAllergeniSelezionati: Set<number> = new Set();
  addErrore: string | null = null;
  isSavingAdd = false;

  // ── Toast ──────────────────────────────────────────────────────
  toastMsg: string | null = null;
  toastTipo: 'success' | 'error' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  // ── QR ────────────────────────────────────────────────────────
  qrVisible = false;

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

  ngOnDestroy(): void {
    this.fermaAutoplay();
  }

  // ── Getter stile dinamico (usati nel template) ─────────────────

  get colorePrimario(): string {
    return this.menu?.colorePrimario || DEFAULT_COLORE_PRIMARIO;
  }

  get coloreSecondario(): string {
    return this.menu?.coloreSecondario || DEFAULT_COLORE_SECONDARIO;
  }

  get fontMenu(): string {
    return this.menu?.fontMenu || DEFAULT_FONT;
  }

  // ── Caricamento dati ──────────────────────────────────────────

  async caricaDati(id: string): Promise<void> {
    try {
      const [menu, portateRaw, allergeni, piattiRaw] = await Promise.all([
        firstValueFrom(this.http.get<MenuView>(`/api/menus/${id}`)),
        firstValueFrom(this.http.get<PortataView[]>(`/api/portatas?menuId.equals=${id}&size=100`)),
        firstValueFrom(this.http.get<AllergeneView[]>('/api/allergenes?size=200')),
        firstValueFrom(this.http.get<PiattoDelGiornoView[]>(`/api/piatto-del-giornos?menuId.equals=${id}&attivo.equals=true&size=50`)),
      ]);

      this.menu = menu;
      this.allergeniDisponibili = allergeni ?? [];
      this.piattiDelGiorno = piattiRaw ?? [];

      // ── Font personalizzato dal wizard ──
      const fontName = this.fontMenu.replace(/ /g, '+');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;
      document.head.appendChild(link);

      // Logo
      if (menu?.logo && menu?.logoContentType) {
        const dataUrl = `data:${menu.logoContentType};base64,${menu.logo}`;
        this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
      }

      // Immagini per carousel
      const imgs = menu?.immagini ?? [];
      this.modernoImmagini = [...imgs];
      this.modernoImmaginiCaricate = new Array(imgs.length).fill(false);
      this.rusticoImmagini = [...imgs];
      this.rusticoImmaginiCaricate = new Array(imgs.length).fill(false);

      // Carica contatti (se il menu ha l'endpoint)
      try {
        const contatti = await firstValueFrom(this.http.get<any>(`/api/menus/${id}/contatti`));
        if (Array.isArray(contatti)) {
          this.listeContatti = contatti;
        } else if (contatti?.contatti) {
          this.listeContatti = [contatti];
        }
      } catch {
        this.listeContatti = [];
      }

      // Carica prodotti per ogni portata in parallelo
      const portateConProdotti = await Promise.all(
        (portateRaw ?? []).map(async portata => {
          const prodotti = await firstValueFrom(this.http.get<ProdottoView[]>(`/api/prodottos?portataId.equals=${portata.id}&size=200`));
          return { ...portata, prodotti: prodotti ?? [], aperta: false };
        }),
      );

      this.portate = this.ordinaPortate(portateConProdotti);

      // Avvia autoplay carousel se ci sono immagini
      if (imgs.length > 1) {
        this.avviaAutoplay();
      }
    } catch (err) {
      console.error('Errore caricamento menu:', err);
      this.errore = true;
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private ordinaPortate(portate: PortataView[]): PortataView[] {
    return [...portate].sort((a, b) => {
      if (a.tipo === 'DEFAULT' && b.tipo === 'DEFAULT')
        return (ORDINE_PORTATE[a.nomeDefault ?? ''] ?? 99) - (ORDINE_PORTATE[b.nomeDefault ?? ''] ?? 99);
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

  getAllergeneIconPath(a: AllergeneView): string | null {
    if (a.nomeDefault && a.nomeDefault !== 'PERSONALIZZATO') {
      return `/content/images/allergeni/${a.nomeDefault.toLowerCase()}.svg`;
    }
    return null;
  }

  // Alias usato dal template HTML
  getAllergeneIcona(a: AllergeneView): string | null {
    return this.getAllergeneIconPath(a);
  }

  get tuttiAllergeniMenu(): AllergeneView[] {
    const map = new Map<number, AllergeneView>();
    this.portate.forEach(p => (p.prodotti ?? []).forEach(prod => (prod.allergenis ?? []).forEach(a => map.set(a.id, a))));
    return Array.from(map.values());
  }

  // Alias usato dal menu-public per compatibilità nel template view
  getAllergeniMenu(): AllergeneView[] {
    return this.tuttiAllergeniMenu;
  }

  // ── Navigazione ───────────────────────────────────────────────

  tornaAiMieiMenu(): void {
    this.router.navigate(['/menu']);
  }

  tornaHome(): void {
    this.router.navigate(['/home']);
  }

  vaiAdAggiungiProdotto(portataId: number): void {
    this.router.navigate(['/prodotto/new'], { queryParams: { portataId } });
  }

  // ── Contrasto colore ──────────────────────────────────────────

  getContrastColor(hex: string): string {
    if (!hex) return '#000000';
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
  }

  // ── Traduzione / Lingua ───────────────────────────────────────

  getUI(key: string): string {
    const lang = this.linguaCorrente;
    if (UI_LABELS[lang]?.[key]) return UI_LABELS[lang][key];
    return UI_LABELS['it']?.[key] ?? key;
  }

  getT(text: string | null | undefined): string {
    if (!text) return '';
    if (this.linguaCorrente === 'it') return text;
    const cacheKey = this.linguaCorrente;
    return this.traduzioniCache[cacheKey]?.[text] ?? text;
  }

  async cambiaLingua(codice: string): Promise<void> {
    this.mostraDropdownLingua = false;
    if (codice === this.linguaCorrente) return;

    if (codice === 'it') {
      this.linguaCorrente = 'it';
      this.cdr.markForCheck();
      return;
    }

    this.isTraducendo = true;
    this.cdr.markForCheck();

    try {
      // Raccogli tutti i testi da tradurre
      const testi = new Set<string>();
      this.portate.forEach(p =>
        (p.prodotti ?? []).forEach(prod => {
          if (prod.nome) testi.add(prod.nome);
          if (prod.descrizione) testi.add(prod.descrizione);
        }),
      );
      this.piattiDelGiorno.forEach(pdg => {
        if (pdg.nome) testi.add(pdg.nome);
        if (pdg.descrizione) testi.add(pdg.descrizione);
        if (pdg.prodotto?.nome) testi.add(pdg.prodotto.nome);
        if (pdg.prodotto?.descrizione) testi.add(pdg.prodotto.descrizione);
      });

      if (testi.size > 0) {
        try {
          const result = await firstValueFrom(
            this.http.post<Record<string, string>>(`/api/traduci`, {
              testi: Array.from(testi),
              linguaDestinazione: codice,
            }),
          );
          if (!this.traduzioniCache[codice]) this.traduzioniCache[codice] = {};
          Object.assign(this.traduzioniCache[codice], result);
        } catch {
          // Traduzione fallita, continuiamo con lingua originale
          this.erroreTraduzioneVisible = true;
          setTimeout(() => {
            this.erroreTraduzioneVisible = false;
            this.cdr.markForCheck();
          }, 4000);
        }
      }

      this.linguaCorrente = codice;
    } finally {
      this.isTraducendo = false;
      this.cdr.markForCheck();
    }
  }

  // ── Safe SVG / HTML ───────────────────────────────────────────

  getSafeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getSocialIconSvg(reteSociale: string | undefined): string | null {
    if (!reteSociale) return null;
    return SOCIAL_ICONS[reteSociale] ?? null;
  }

  getSafeSocialSvg(reteSociale: string | undefined): SafeHtml {
    const svg = this.getSocialIconSvg(reteSociale);
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : '';
  }

  // ── Contatti helpers ──────────────────────────────────────────

  getContattoLink(item: any): string | null {
    if (!item?.valore) return null;
    switch (item.tipo) {
      case 'TELEFONO':
        return `tel:${item.valore}`;
      case 'EMAIL':
        return `mailto:${item.valore}`;
      case 'SOCIAL':
        return item.valore.startsWith('http') ? item.valore : `https://${item.valore}`;
      case 'INDIRIZZO':
        return `https://maps.google.com/?q=${encodeURIComponent(item.valore)}`;
      default:
        return null;
    }
  }

  getContattoLabel(item: any): string {
    if (item.etichetta) return item.etichetta;
    switch (item.tipo) {
      case 'TELEFONO':
        return item.valore ?? 'Telefono';
      case 'EMAIL':
        return item.valore ?? 'Email';
      case 'SOCIAL':
        return item.reteSociale ?? 'Social';
      case 'INDIRIZZO':
        return 'Indirizzo';
      default:
        return item.valore ?? '';
    }
  }

  // ── Moderno navigation ────────────────────────────────────────

  modernoApriPortata(portata: PortataView): void {
    this.modernoTabAttiva = portata.id;
    this.modernoPortataAttiva = portata;
    this.fermaAutoplay();
    this.cdr.markForCheck();
  }

  modernoTornaHome(): void {
    this.modernoTabAttiva = null;
    this.modernoPortataAttiva = null;
    if (this.modernoImmagini.length > 1) {
      this.avviaAutoplay();
    }
    this.cdr.markForCheck();
  }

  modernoGoToSlide(index: number): void {
    const len = this.modernoImmagini.length;
    if (len === 0) return;
    this.modernoCarouselIndex = ((index % len) + len) % len;
    this.cdr.markForCheck();
  }

  // ── Rustico navigation ────────────────────────────────────────

  rusticoApriTab(tabId: string | number, portata: PortataView | null): void {
    this.rusticoTabAttiva = tabId;
    this.rusticoPortataAttiva = portata;
    this.fermaAutoplay();
    this.cdr.markForCheck();
  }

  rusticoTornaCarosello(): void {
    this.rusticoTabAttiva = null;
    this.rusticoPortataAttiva = null;
    if (this.rusticoImmagini.length > 1) {
      this.avviaAutoplay();
    }
    this.cdr.markForCheck();
  }

  rusticoGoToSlide(index: number): void {
    const len = this.rusticoImmagini.length;
    if (len === 0) return;
    this.rusticoCarouselIndex = ((index % len) + len) % len;
    this.cdr.markForCheck();
  }

  // ── Carousel autoplay & touch ─────────────────────────────────

  private avviaAutoplay(): void {
    this.fermaAutoplay();
    this.autoplayTimer = setInterval(() => {
      if (this.isModerno && this.modernoImmagini.length > 1 && this.modernoTabAttiva === null) {
        this.modernoCarouselIndex = (this.modernoCarouselIndex + 1) % this.modernoImmagini.length;
        this.cdr.markForCheck();
      }
      if (this.isRustico && this.rusticoImmagini.length > 1 && this.rusticoTabAttiva === null) {
        this.rusticoCarouselIndex = (this.rusticoCarouselIndex + 1) % this.rusticoImmagini.length;
        this.cdr.markForCheck();
      }
    }, 4000);
  }

  fermaAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  onTouchStart(event: TouchEvent, _tipo: string): void {
    this.touchStartX = event.touches[0]?.clientX ?? 0;
  }

  onTouchEnd(event: TouchEvent, tipo: string): void {
    const endX = event.changedTouches[0]?.clientX ?? 0;
    const diff = this.touchStartX - endX;
    if (Math.abs(diff) < 50) return;

    if (tipo === 'moderno') {
      if (diff > 0) this.modernoGoToSlide(this.modernoCarouselIndex + 1);
      else this.modernoGoToSlide(this.modernoCarouselIndex - 1);
    } else if (tipo === 'rustico') {
      if (diff > 0) this.rusticoGoToSlide(this.rusticoCarouselIndex + 1);
      else this.rusticoGoToSlide(this.rusticoCarouselIndex - 1);
    }
  }

  onImmagineCaricata(tipo: string, index: number): void {
    if (tipo === 'moderno') {
      this.modernoImmaginiCaricate[index] = true;
    } else if (tipo === 'rustico') {
      this.rusticoImmaginiCaricate[index] = true;
    }
    this.cdr.markForCheck();
  }

  onImmagineErrore(tipo: string, index: number): void {
    // Rimuovi l'immagine che non è stata caricata
    if (tipo === 'moderno') {
      this.modernoImmagini.splice(index, 1);
      this.modernoImmaginiCaricate.splice(index, 1);
      if (this.modernoCarouselIndex >= this.modernoImmagini.length) {
        this.modernoCarouselIndex = 0;
      }
    } else if (tipo === 'rustico') {
      this.rusticoImmagini.splice(index, 1);
      this.rusticoImmaginiCaricate.splice(index, 1);
      if (this.rusticoCarouselIndex >= this.rusticoImmagini.length) {
        this.rusticoCarouselIndex = 0;
      }
    }
    this.cdr.markForCheck();
  }

  // ── Toggle accordion ──────────────────────────────────────────

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

  // ── Visibilità prodotto ───────────────────────────────────────

  async toggleVisibile(prodotto: ProdottoView, _portata: PortataView): Promise<void> {
    const nuovoStato = !prodotto.visibile;
    const vecchio = prodotto.visibile;
    prodotto.visibile = nuovoStato;
    this.cdr.markForCheck();
    try {
      await firstValueFrom(this.http.patch(`/api/prodottos/${prodotto.id}`, { id: prodotto.id, visibile: nuovoStato }));
      this.mostraToast(nuovoStato ? '✅ Prodotto reso visibile' : '🔒 Prodotto nascosto', 'success');
    } catch {
      prodotto.visibile = vecchio;
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
      aggiornato.allergenis = allergenis
        .map(a => this.allergeniDisponibili.find(al => al.id === a.id))
        .filter((a): a is AllergeneView => !!a);
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

  // ── Aggiungi prodotto inline ──────────────────────────────────

  apriAggiuntaProdotto(portata: PortataView): void {
    this.portataPerAggiunta = portata;
    this.addNome = '';
    this.addDescrizione = '';
    this.addPrezzo = null;
    this.addVisibile = true;
    this.addAllergeniSelezionati = new Set();
    this.addErrore = null;
    this.cdr.markForCheck();
  }

  chiudiAggiuntaProdotto(): void {
    this.portataPerAggiunta = null;
    this.addErrore = null;
    this.cdr.markForCheck();
  }

  toggleAddAllergene(id: number): void {
    if (this.addAllergeniSelezionati.has(id)) this.addAllergeniSelezionati.delete(id);
    else this.addAllergeniSelezionati.add(id);
    this.addAllergeniSelezionati = new Set(this.addAllergeniSelezionati);
    this.cdr.markForCheck();
  }

  async salvaNuovoProdotto(): Promise<void> {
    if (!this.portataPerAggiunta) return;
    this.addErrore = null;
    if (!this.addNome.trim()) {
      this.addErrore = 'Il nome è obbligatorio.';
      return;
    }
    if (!this.addPrezzo || this.addPrezzo <= 0) {
      this.addErrore = 'Inserisci un prezzo valido.';
      return;
    }
    this.isSavingAdd = true;
    try {
      const allergenis = Array.from(this.addAllergeniSelezionati).map(id => ({ id }));
      const body = {
        nome: this.addNome.trim(),
        descrizione: this.addDescrizione.trim() || null,
        prezzo: this.addPrezzo,
        visibile: this.addVisibile,
        portata: { id: this.portataPerAggiunta.id },
        allergenis,
      };
      const creato = await firstValueFrom(this.http.post<ProdottoView>('/api/prodottos', body));
      const prodottoConAllergeni: ProdottoView = {
        ...creato,
        allergenis: allergenis.map(a => this.allergeniDisponibili.find(al => al.id === a.id)).filter((a): a is AllergeneView => !!a),
      };
      this.portate = this.portate.map(p => {
        if (p.id === this.portataPerAggiunta!.id) {
          return { ...p, prodotti: [...(p.prodotti ?? []), prodottoConAllergeni] };
        }
        return p;
      });
      this.chiudiAggiuntaProdotto();
      this.mostraToast('✅ Piatto aggiunto con successo', 'success');
    } catch (err) {
      console.error('Errore aggiunta prodotto:', err);
      this.addErrore = 'Errore durante il salvataggio. Riprova.';
    } finally {
      this.isSavingAdd = false;
      this.cdr.markForCheck();
    }
  }

  // ── QR ────────────────────────────────────────────────────────

  get qrUrl(): string {
    return `${window.location.origin}/menu-public/${this.menu?.id}`;
  }
  get qrImageUrl(): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(this.qrUrl)}`;
  }
  mostraQr(): void {
    this.qrVisible = true;
    this.cdr.markForCheck();
  }
  chiudiQr(): void {
    this.qrVisible = false;
    this.cdr.markForCheck();
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
}
