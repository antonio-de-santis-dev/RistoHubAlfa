import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';

const initialAccount: Account = {} as Account;

@Component({
  selector: 'jhi-settings',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  // NAVIGAZIONE TRA SEZIONI
  active = signal<'overview' | 'edit' | 'password'>('overview');
  activeSection() {
    return this.active();
  }
  goTo(section: 'overview' | 'edit' | 'password') {
    this.active.set(section);
  }

  // PROFILO
  success = signal(false);
  languages = LANGUAGES;
  account = signal<Account | null>(null);

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, { nonNullable: true }),
    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
  });

  // INJECTIONS
  private readonly accountService = inject(AccountService);
  private readonly translateService = inject(TranslateService);
  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account.set(account);
        this.settingsForm.patchValue(account);
      }
    });
  }

  save(): void {
    this.success.set(false);
    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success.set(true);
      this.accountService.authenticate(account);
      if (account.langKey !== this.translateService.currentLang) {
        this.translateService.use(account.langKey);
      }
    });
  }

  // CAMBIO PASSWORD
  pwSuccess = signal(false);
  pwError = signal(false);
  pwDoNotMatch = signal(false);

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });

  changePassword(): void {
    this.pwSuccess.set(false);
    this.pwError.set(false);
    this.pwDoNotMatch.set(false);

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.pwDoNotMatch.set(true);
      return;
    }

    // POST diretto all'endpoint standard (modifica se il tuo backend usa un altro path)
    this.http.post('/api/account/change-password', { currentPassword, newPassword }).subscribe({
      next: () => {
        this.pwSuccess.set(true);
        this.passwordForm.reset();
      },
      error: () => {
        this.pwError.set(true);
      },
    });
  }
}
