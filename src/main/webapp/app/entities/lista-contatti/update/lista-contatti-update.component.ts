import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IListaContatti } from '../lista-contatti.model';
import { ListaContattiService } from '../service/lista-contatti.service';
import { ListaContattiFormGroup, ListaContattiFormService } from './lista-contatti-form.service';

@Component({
  selector: 'jhi-lista-contatti-update',
  templateUrl: './lista-contatti-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ListaContattiUpdateComponent implements OnInit {
  isSaving = false;
  listaContatti: IListaContatti | null = null;

  protected listaContattiService = inject(ListaContattiService);
  protected listaContattiFormService = inject(ListaContattiFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ListaContattiFormGroup = this.listaContattiFormService.createListaContattiFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ listaContatti }) => {
      this.listaContatti = listaContatti;
      if (listaContatti) {
        this.updateForm(listaContatti);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const listaContatti = this.listaContattiFormService.getListaContatti(this.editForm);
    if (listaContatti.id !== null) {
      this.subscribeToSaveResponse(this.listaContattiService.update(listaContatti));
    } else {
      this.subscribeToSaveResponse(this.listaContattiService.create(listaContatti));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IListaContatti>>): void {
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

  protected updateForm(listaContatti: IListaContatti): void {
    this.listaContatti = listaContatti;
    this.listaContattiFormService.resetForm(this.editForm, listaContatti);
  }
}
