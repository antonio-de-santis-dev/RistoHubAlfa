package main.domain.enumeration;

/**
 * I 14 allergeni obbligatori per legge (Reg. UE 1169/2011).
 * Ogni valore corrisponde a un file PNG: /assets/images/allergeni/{valore_minuscolo}.png
 * Es: GLUTINE -> /assets/images/allergeni/glutine.png
 * Gli allergeni personalizzati usano sempre: /assets/images/allergeni/custom.png
 * Inseriti come data seeder Liquibase al primo avvio dell'applicazione.
 */
public enum NomeAllergeneDefault {
    GLUTINE,
    UOVO,
    LATTE,
    ARACHIDI,
    FRUTTA_A_GUSCIO,
    PESCE,
    MOLLUSCHI,
    CROSTACEI,
    SOIA,
    SESAMO,
    SEDANO,
    SENAPE,
    SOLFITI,
    LUPINI,
}
