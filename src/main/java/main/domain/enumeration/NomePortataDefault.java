package main.domain.enumeration;

/**
 * Portate predefinite con ordine fisso nel menu.
 * Le PERSONALIZZATE si inseriscono sempre dopo CONTORNO e prima di DOLCE.
 *
 * Ordine di visualizzazione (gestito dal campo \"ordine\" nel Service):
 * 1. ANTIPASTO   -> ordine = 10
 * 2. PRIMO       -> ordine = 20
 * 3. SECONDO     -> ordine = 30
 * 4. CONTORNO    -> ordine = 40
 * [portate PERSONALIZZATE] -> ordine = 45, 46, 47 ... (auto-incrementale)
 * 5. DOLCE       -> ordine = 50
 * 6. BEVANDA     -> ordine = 60
 * 7. VINO_ROSSO  -> ordine = 70
 * 8. VINO_BIANCO -> ordine = 80
 * 9. VINO_ROSATO -> ordine = 90
 * 10. BIRRA       -> ordine = 100
 * 11. DIGESTIVO   -> ordine = 110
 */
public enum NomePortataDefault {
    ANTIPASTO,
    PRIMO,
    SECONDO,
    CONTORNO,
    DOLCE,
    BEVANDA,
    VINO_ROSSO,
    VINO_BIANCO,
    VINO_ROSATO,
    BIRRA,
    DIGESTIVO,
}
