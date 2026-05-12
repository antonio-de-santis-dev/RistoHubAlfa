// PERCORSO: src/main/java/main/service/MaxMenuRaggiuntoException.java
package main.service;

/**
 * Eccezione lanciata quando un utente tenta di creare più menu
 * di quanti consentiti dal suo livello (LivelloUtente).
 *
 * LIVELLO_1 → max 1 menu
 * LIVELLO_2 → max 2 menu
 * LIVELLO_3 → illimitati (mai lanciata)
 */
public class MaxMenuRaggiuntoException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public MaxMenuRaggiuntoException() {
        super("Hai raggiunto il numero massimo di menu consentiti dal tuo piano. Elimina un menu esistente o aggiorna il tuo livello.");
    }

    public MaxMenuRaggiuntoException(String message) {
        super(message);
    }
}
