package main.service;

/**
 * Eccezione lanciata quando un utente tenta di creare un piatto del giorno
 * ma il suo livello non lo consente, oppure ha raggiunto il limite.
 *
 * LIVELLO_1 → non disponibile
 * LIVELLO_2 → max 5 piatti del giorno totali tra tutti i menu
 *
 * Percorso: src/main/java/main/service/PiattoDelGiornoNonDisponibileException.java
 */
public class PiattoDelGiornoNonDisponibileException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /** Usata per LIVELLO_1: funzionalità non disponibile */
    public PiattoDelGiornoNonDisponibileException() {
        super(
            "Il piatto del giorno non è disponibile con il tuo livello attuale. " +
            "Passa al livello 2 o superiore per sbloccare questa funzionalità."
        );
    }

    /** Usata per LIVELLO_2: limite raggiunto */
    public PiattoDelGiornoNonDisponibileException(int max) {
        super(
            "Hai raggiunto il limite di " +
            max +
            " piatti del giorno. " +
            "Disattiva un piatto esistente oppure passa al livello 3 per aggiungerne altri."
        );
    }
}
