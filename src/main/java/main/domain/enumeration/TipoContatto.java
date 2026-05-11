package main.domain.enumeration;

/**
 * Tipo di recapito nella card contatti.
 *
 * Strategia icone:
 * TELEFONO  -> icona Tabler: <i class=\"ti ti-phone\">
 * EMAIL     -> icona Tabler: <i class=\"ti ti-mail\">
 * SITO_WEB  -> icona Tabler: <i class=\"ti ti-world\">
 * Social    -> SVG inline iniettata dalla funzione getSocialIconSvg(tipo)
 * definita in shared/model/social-icons.ts (gia' presente nel progetto)
 *
 * Nessun file PNG o asset esterno per i social: la stringa SVG
 * e' embedded nel TypeScript, zero dipendenze da file statici.
 */
public enum TipoContatto {
    TELEFONO,
    EMAIL,
    SITO_WEB,
    FACEBOOK,
    INSTAGRAM,
    X,
    YOUTUBE,
    TIKTOK,
    TELEGRAM,
    MESSENGER,
    THREADS,
    SNAPCHAT,
    WHATSAPP,
    GOOGLE,
    TRIPADVISOR,
}
