import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IListaContatti, NewListaContatti } from '../lista-contatti.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IListaContatti for edit and NewListaContattiFormGroupInput for create.
 */
type ListaContattiFormGroupInput = IListaContatti | PartialWithRequiredKeyOf<NewListaContatti>;

type ListaContattiFormDefaults = Pick<NewListaContatti, 'id'>;

type ListaContattiFormGroupContent = {
  id: FormControl<IListaContatti['id'] | NewListaContatti['id']>;
  note: FormControl<IListaContatti['note']>;
};

export type ListaContattiFormGroup = FormGroup<ListaContattiFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ListaContattiFormService {
  createListaContattiFormGroup(listaContatti: ListaContattiFormGroupInput = { id: null }): ListaContattiFormGroup {
    const listaContattiRawValue = {
      ...this.getFormDefaults(),
      ...listaContatti,
    };
    return new FormGroup<ListaContattiFormGroupContent>({
      id: new FormControl(
        { value: listaContattiRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      note: new FormControl(listaContattiRawValue.note),
    });
  }

  getListaContatti(form: ListaContattiFormGroup): IListaContatti | NewListaContatti {
    return form.getRawValue() as IListaContatti | NewListaContatti;
  }

  resetForm(form: ListaContattiFormGroup, listaContatti: ListaContattiFormGroupInput): void {
    const listaContattiRawValue = { ...this.getFormDefaults(), ...listaContatti };
    form.reset(
      {
        ...listaContattiRawValue,
        id: { value: listaContattiRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ListaContattiFormDefaults {
    return {
      id: null,
    };
  }
}
