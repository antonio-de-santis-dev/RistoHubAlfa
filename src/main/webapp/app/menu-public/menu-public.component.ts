import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'app-menu-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-public.component.html',
  styleUrl: './menu-public.component.scss',
})
export default class MenuPublicComponent implements OnInit {
  // Signals
  menu = signal<any | null>(null);
  isLoading = signal(true);
  errore = signal<string | null>(null);

  // UI / layout
  isModerno = false;
  isRustico = false;

  // Stile
  fontTesto = 'Inter, sans-serif';
  colorePrimario = '#222';
  coloreSecondario = '#fff';
  logoUrl: string | null = null;

  // Lingua
  mostraDropdownLingua = false;
  linguaCorrente = 'it';
  linguaAttuale: any = { codice: 'it', nome: 'Italiano', svgBandiera: '' };
  LINGUE = [
    { codice: 'it', nome: 'Italiano', svgBandiera: '' },
    { codice: 'en', nome: 'English', svgBandiera: '' },
    { codice: 'fr', nome: 'Français', svgBandiera: '' },
    { codice: 'de', nome: 'Deutsch', svgBandiera: '' },
  ];

  // Traduzione
  isTraducendo = false;
  erroreTraduzioneVisible = false;

  // Contenuti
  piattiDelGiorno: any[] = [];
  piattiGiornoAperti = false;
  portate: any[] = [];
  listeContatti: any[] = [];
  tuttiAllergeniMenu: any[] = [];

  // Modern layout
  modernoTabAttiva: string | null = null;
  modernoPortataAttiva: any = null;
  modernoImmagini: string[] = [];
  modernoImmaginiCaricate: boolean[] = [];
  modernoCarouselIndex = 0;
  autoplayTimer: any = null;

  // Rustico layout
  rusticoTabAttiva: string | null = null;
  rusticoPortataAttiva: any = null;
  rusticoImmagini: string[] = [];
  rusticoImmaginiCaricate: boolean[] = [];
  rusticoCarouselIndex = 0;

  // injections
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ApplicationConfigService);
  private readonly sanitizer = inject(DomSanitizer);

  // Social SVG map (abbreviato; sostituisci con SVG completi se vuoi)
  private readonly SOCIAL_SVG: Record<string, string> = {
    FACEBOOK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`,
    INSTAGRAM: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.225 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.856-.601-3.698-1.942-5.039C20.646.673 18.804.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
    X: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errore.set('Menu non trovato.');
      this.isLoading.set(false);
      return;
    }
    const url = this.configService.getEndpointFor(`api/public/menu/${id}`);
    this.http.get<any>(url).subscribe({
      next: data => {
        this.menu.set(data);
        this.portate = data.portate ?? [];
        this.piattiDelGiorno = data.piattiDelGiorno ?? [];
        this.listeContatti = data.contatti?.contatti ? [{ nome: 'Contatti', items: data.contatti.contatti }] : [];
        this.tuttiAllergeniMenu = this.computeAllergeni(data);
        this.colorePrimario = data.colorePrimario ?? this.colorePrimario;
        this.coloreSecondario = data.coloreSecondario ?? this.coloreSecondario;
        this.fontTesto = data.fontTesto ?? this.fontTesto;
        this.logoUrl = data.logoUrl ?? null;
        this.isModerno = data.layout === 'MODERNO';
        this.isRustico = data.layout === 'RUSTICO';
        this.modernoImmagini = data.immagini ?? [];
        this.modernoImmaginiCaricate = this.modernoImmagini.map(() => false);
        this.rusticoImmagini = data.immaginiRustiche ?? [];
        this.rusticoImmaginiCaricate = this.rusticoImmagini.map(() => false);
        this.isLoading.set(false);
      },
      error: () => {
        this.errore.set('Menu non disponibile.');
        this.isLoading.set(false);
      },
    });
  }

  // -----------------------
  // Lingua / SVG safe
  // -----------------------
  cambiaLingua(codice: string): void {
    this.linguaCorrente = codice;
    this.linguaAttuale = this.LINGUE.find(l => l.codice === codice) ?? this.linguaAttuale;
    this.mostraDropdownLingua = false;
  }

  getSafeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg || '');
  }

  // -----------------------
  // Helpers UI / testo
  // -----------------------
  getT(testo: string | undefined): string {
    return testo ?? '';
  }
  getUI(key: string): string {
    const map: any = {
      PIATTI_GIORNO: 'Piatti del giorno',
      PIATTI_GIORNO_SHORT: 'Speciali',
      NESSUN_PIATTO: 'Nessun piatto disponibile',
      ALLERGENI_TITOLO: 'Allergeni',
      ALLERGENI_NOTA: 'Gli allergeni possono variare.',
      PIATTI_PAROLA: 'piatti',
      SELEZIONA_PORTATA: 'Seleziona una portata',
      TORNA_HOME: 'Torna indietro',
    };
    return map[key] ?? key;
  }

  // -----------------------
  // Portate / piatti
  // -----------------------
  togglePiattiGiorno(): void {
    this.piattiGiornoAperti = !this.piattiGiornoAperti;
  }
  togglePortata(portata: any): void {
    portata.aperta = !portata.aperta;
  }
  nomePortata(p: any): string {
    return p.nomeVisualizzato ?? p.nomeDefaultEnum ?? 'Portata';
  }

  // -----------------------
  // Allergeni
  // -----------------------
  private computeAllergeni(data: any): any[] {
    if (!data) return [];
    const map = new Map<number, any>();
    (data.portate ?? []).forEach((p: any) =>
      (p.prodotti ?? []).forEach((pr: any) => (pr.allergenis ?? []).forEach((a: any) => map.set(a.id, a))),
    );
    (data.piattiDelGiorno ?? []).forEach((p: any) => (p.allergenis ?? []).forEach((a: any) => map.set(a.id, a)));
    return [...map.values()];
  }

  getAllergeneIcona(a: any): string | null {
    if (!a) return null;
    if (a.icona && a.iconaContentType) return `data:${a.iconaContentType};base64,${a.icona}`;
    if (a.nomeDefault) return `/assets/images/allergeni/${a.nomeDefault.toLowerCase()}.png`;
    return null;
  }

  // -----------------------
  // Contatti / social
  // -----------------------
  getSocialIconSvg(reteSociale: string): string | null {
    return this.SOCIAL_SVG[reteSociale] ?? null;
  }
  getSafeSocialSvg(reteSociale: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.SOCIAL_SVG[reteSociale] ?? '');
  }

  getContattoLink(c: any): string | null {
    if (!c) return null;
    if (c.tipo === 'TELEFONO') return `tel:${c.valore}`;
    if (c.tipo === 'EMAIL') return `mailto:${c.valore}`;
    if (c.tipo === 'INDIRIZZO') return null;
    return c.valore?.startsWith('http') ? c.valore : `https://${c.valore}`;
  }
  getContattoLabel(c: any): string {
    return c.etichetta ?? c.tipo ?? '';
  }

  // -----------------------
  // Prezzi / formattazione
  // -----------------------
  formatPrezzo(prezzo: number | undefined | null): string {
    if (prezzo == null) return '';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(prezzo);
  }

  // -----------------------
  // Carousel moderno / touch
  // -----------------------
  modernoGoToSlide(i: number): void {
    if (!this.modernoImmagini.length) return;
    if (i < 0) i = this.modernoImmagini.length - 1;
    if (i >= this.modernoImmagini.length) i = 0;
    this.modernoCarouselIndex = i;
  }
  onImmagineCaricata(_: string, index: number): void {
    this.modernoImmaginiCaricate[index] = true;
  }
  onImmagineErrore(_: string, index: number): void {
    this.modernoImmaginiCaricate[index] = true;
  }

  fermaAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
  modernoApriPortata(portata: any): void {
    this.modernoTabAttiva = portata.id;
    this.modernoPortataAttiva = portata;
    this.fermaAutoplay();
  }
  modernoTornaHome(): void {
    this.modernoTabAttiva = null;
    this.modernoPortataAttiva = null;
  }

  // touch handlers
  private touchStartX: number | null = null;
  onTouchStart(ev: TouchEvent, mode: 'moderno' | 'rustico'): void {
    this.touchStartX = ev.touches?.[0]?.clientX ?? null;
  }
  onTouchEnd(ev: TouchEvent, mode: 'moderno' | 'rustico'): void {
    if (this.touchStartX == null) return;
    const endX = ev.changedTouches?.[0]?.clientX ?? null;
    if (endX == null) {
      this.touchStartX = null;
      return;
    }
    const diff = endX - this.touchStartX;
    if (Math.abs(diff) > 40) {
      if (mode === 'moderno') this.modernoGoToSlide(this.modernoCarouselIndex + (diff < 0 ? 1 : -1));
      else this.rusticoGoToSlide(this.rusticoCarouselIndex + (diff < 0 ? 1 : -1));
    }
    this.touchStartX = null;
  }

  // -----------------------
  // Rustico helpers
  // -----------------------
  rusticoApriTab(tab: string, portata: any | null): void {
    this.rusticoTabAttiva = tab;
    this.rusticoPortataAttiva = portata;
  }
  rusticoGoToSlide(i: number): void {
    if (!this.rusticoImmagini.length) return;
    if (i < 0) i = this.rusticoImmagini.length - 1;
    if (i >= this.rusticoImmagini.length) i = 0;
    this.rusticoCarouselIndex = i;
  }
  rusticoTornaCarosello(): void {
    this.rusticoTabAttiva = null;
    this.rusticoPortataAttiva = null;
  }

  // contrast helper
  getContrastColor(hex: string): string {
    if (!hex) return '#000';
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  }
}
