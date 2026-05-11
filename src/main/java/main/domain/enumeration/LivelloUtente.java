package main.domain.enumeration;

/**
 * Livello dell'utente ristoratore.
 * NON sostituisce i ruoli JHipster (ROLE_USER / ROLE_ADMIN),
 * e' un campo aggiuntivo sul ProfiloRistoratore.
 *
 * Funzionalita' COMUNI a tutti i livelli:
 * - Import prodotti da PDF
 * - Traduzione automatica del menu via API esterna
 *
 * Regole di business (implementate nel Service layer):
 * Il controllo si basa sul conteggio dei Menu ESISTENTI dell'utente,
 * non su quanti ne ha mai creati. Se un utente cancella un menu,
 * quel posto torna disponibile e puo' crearne uno nuovo.
 *
 * LIVELLO_1 -> max 1 menu attivo simultaneo
 * piatti del giorno: NON disponibili
 * LIVELLO_2 -> max 2 menu attivi simultanei
 * piatti del giorno: max 5 (conteggio totale tra tutti i suoi menu)
 * LIVELLO_3 -> menu illimitati
 * piatti del giorno illimitati
 */
public enum LivelloUtente {
    LIVELLO_1,
    LIVELLO_2,
    LIVELLO_3,
}
