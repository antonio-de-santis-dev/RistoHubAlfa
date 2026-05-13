// ═══════════════════════════════════════════════════════════════════
// PERCORSO: src/main/webapp/app/account/register/register.model.ts
// ISTRUZIONE: Sostituisce integralmente il file esistente.
// Aggiunge firstName e lastName richiesti dal backend JHipster.
// ═══════════════════════════════════════════════════════════════════

export class Registration {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public langKey: string,
    public firstName: string = '',
    public lastName: string = '',
  ) {}
}
