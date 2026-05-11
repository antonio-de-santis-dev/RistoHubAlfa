import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { LivelloUtente } from 'app/entities/enumerations/livello-utente.model';
import { ProfiloRistoratoreService } from '../service/profilo-ristoratore.service';
import { IProfiloRistoratore } from '../profilo-ristoratore.model';
import { ProfiloRistoratoreFormGroup, ProfiloRistoratoreFormService } from './profilo-ristoratore-form.service';

@Component({
  selector: 'jhi-profilo-ristoratore-update',
  templateUrl: './profilo-ristoratore-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProfiloRistoratoreUpdateComponent implements OnInit {
  isSaving = false;
  profiloRistoratore: IProfiloRistoratore | null = null;
  livelloUtenteValues = Object.keys(LivelloUtente);

  usersSharedCollection: IUser[] = [];

  protected profiloRistoratoreService = inject(ProfiloRistoratoreService);
  protected profiloRistoratoreFormService = inject(ProfiloRistoratoreFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProfiloRistoratoreFormGroup = this.profiloRistoratoreFormService.createProfiloRistoratoreFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profiloRistoratore }) => {
      this.profiloRistoratore = profiloRistoratore;
      if (profiloRistoratore) {
        this.updateForm(profiloRistoratore);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profiloRistoratore = this.profiloRistoratoreFormService.getProfiloRistoratore(this.editForm);
    if (profiloRistoratore.id !== null) {
      this.subscribeToSaveResponse(this.profiloRistoratoreService.update(profiloRistoratore));
    } else {
      this.subscribeToSaveResponse(this.profiloRistoratoreService.create(profiloRistoratore));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfiloRistoratore>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(profiloRistoratore: IProfiloRistoratore): void {
    this.profiloRistoratore = profiloRistoratore;
    this.profiloRistoratoreFormService.resetForm(this.editForm, profiloRistoratore);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, profiloRistoratore.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.profiloRistoratore?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
