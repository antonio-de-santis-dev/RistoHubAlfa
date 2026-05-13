// ═══════════════════════════════════════════════════════════════════
// PERCORSO: src/main/webapp/app/account/register/register.component.ts
// ISTRUZIONE: Sostituisce integralmente il file esistente.
//
// Modifiche rispetto alla versione Alfa:
//   1. Aggiunti campi firstName e lastName nel form
//   2. Aggiunti ngOnInit / ngOnDestroy per nascondere navbar/footer
//      (stesso pattern della landing e del vecchio register)
//   3. Integrato LoaderService durante la chiamata POST /api/register
//   4. Passati firstName e lastName al RegisterService.save()
// ═══════════════════════════════════════════════════════════════════

import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import SharedModule from 'app/shared/shared.module';
import PasswordStrengthBarComponent from '../password/password-strength-bar/password-strength-bar.component';
import { RegisterService } from './register.service';
import { LoaderService } from 'app/shared/loader/loader.service';

@Component({
  selector: 'jhi-register',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule, PasswordStrengthBarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent implements AfterViewInit, OnInit, OnDestroy {
  login = viewChild.required<ElementRef>('login');

  doNotMatch = signal(false);
  error = signal(false);
  errorEmailExists = signal(false);
  errorUserExists = signal(false);
  success = signal(false);

  // Nasconde navbar/footer — stesso pattern della landing page
  private styleTag: HTMLStyleElement | null = null;

  private readonly translateService = inject(TranslateService);
  private readonly registerService = inject(RegisterService);
  private readonly loaderService = inject(LoaderService);

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]*$'),
      ],
    }),
    // ── CAMPI AGGIUNTI ─────────────────────────────────────────────
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    // ───────────────────────────────────────────────────────────────
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });

  ngOnInit(): void {
    // Inietta stile inline per nascondere navbar/footer su questa pagina
    this.styleTag = document.createElement('style');
    this.styleTag.textContent = `
      jhi-navbar, nav.navbar, jhi-footer, footer,
      router-outlet[name="navbar"] ~ * { display: none !important; }
    `;
    document.head.appendChild(this.styleTag);
  }

  ngAfterViewInit(): void {
    this.login().nativeElement.focus();
  }

  ngOnDestroy(): void {
    // Rimuove lo stile quando si esce dalla pagina
    if (this.styleTag) {
      this.styleTag.remove();
      this.styleTag = null;
    }
  }

  register(): void {
    this.doNotMatch.set(false);
    this.error.set(false);
    this.errorEmailExists.set(false);
    this.errorUserExists.set(false);

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch.set(true);
      return;
    }

    const { login, email, firstName, lastName } = this.registerForm.getRawValue();

    // Mostra il loader durante la chiamata HTTP
    this.loaderService.show();
    this.registerService
      .save({
        login,
        email,
        password,
        langKey: this.translateService.currentLang,
        firstName,
        lastName,
      })
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.success.set(true);
        },
        error: (response: HttpErrorResponse) => {
          this.loaderService.hide();
          this.processError(response);
        },
      });
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists.set(true);
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists.set(true);
    } else {
      this.error.set(true);
    }
  }
}
