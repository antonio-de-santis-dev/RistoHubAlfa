import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IListaContatti } from 'app/entities/lista-contatti/lista-contatti.model';
import { ListaContattiService } from 'app/entities/lista-contatti/service/lista-contatti.service';
import { TipoContatto } from 'app/entities/enumerations/tipo-contatto.model';
import { ContattoItemService } from '../service/contatto-item.service';
import { IContattoItem } from '../contatto-item.model';
import { ContattoItemFormGroup, ContattoItemFormService } from './contatto-item-form.service';

@Component({
  selector: 'jhi-contatto-item-update',
  templateUrl: './contatto-item-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ContattoItemUpdateComponent implements OnInit {
  isSaving = false;
  contattoItem: IContattoItem | null = null;
  tipoContattoValues = Object.keys(TipoContatto);

  listaContattisSharedCollection: IListaContatti[] = [];

  protected contattoItemService = inject(ContattoItemService);
  protected contattoItemFormService = inject(ContattoItemFormService);
  protected listaContattiService = inject(ListaContattiService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ContattoItemFormGroup = this.contattoItemFormService.createContattoItemFormGroup();

  compareListaContatti = (o1: IListaContatti | null, o2: IListaContatti | null): boolean =>
    this.listaContattiService.compareListaContatti(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contattoItem }) => {
      this.contattoItem = contattoItem;
      if (contattoItem) {
        this.updateForm(contattoItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contattoItem = this.contattoItemFormService.getContattoItem(this.editForm);
    if (contattoItem.id !== null) {
      this.subscribeToSaveResponse(this.contattoItemService.update(contattoItem));
    } else {
      this.subscribeToSaveResponse(this.contattoItemService.create(contattoItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContattoItem>>): void {
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

  protected updateForm(contattoItem: IContattoItem): void {
    this.contattoItem = contattoItem;
    this.contattoItemFormService.resetForm(this.editForm, contattoItem);

    this.listaContattisSharedCollection = this.listaContattiService.addListaContattiToCollectionIfMissing<IListaContatti>(
      this.listaContattisSharedCollection,
      contattoItem.lista,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.listaContattiService
      .query()
      .pipe(map((res: HttpResponse<IListaContatti[]>) => res.body ?? []))
      .pipe(
        map((listaContattis: IListaContatti[]) =>
          this.listaContattiService.addListaContattiToCollectionIfMissing<IListaContatti>(listaContattis, this.contattoItem?.lista),
        ),
      )
      .subscribe((listaContattis: IListaContatti[]) => (this.listaContattisSharedCollection = listaContattis));
  }
}
