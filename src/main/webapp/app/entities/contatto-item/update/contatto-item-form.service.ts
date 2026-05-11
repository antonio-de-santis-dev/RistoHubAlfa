import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IContattoItem, NewContattoItem } from '../contatto-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IContattoItem for edit and NewContattoItemFormGroupInput for create.
 */
type ContattoItemFormGroupInput = IContattoItem | PartialWithRequiredKeyOf<NewContattoItem>;

type ContattoItemFormDefaults = Pick<NewContattoItem, 'id'>;

type ContattoItemFormGroupContent = {
  id: FormControl<IContattoItem['id'] | NewContattoItem['id']>;
  tipo: FormControl<IContattoItem['tipo']>;
  valore: FormControl<IContattoItem['valore']>;
  etichetta: FormControl<IContattoItem['etichetta']>;
  ordine: FormControl<IContattoItem['ordine']>;
  lista: FormControl<IContattoItem['lista']>;
};

export type ContattoItemFormGroup = FormGroup<ContattoItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContattoItemFormService {
  createContattoItemFormGroup(contattoItem: ContattoItemFormGroupInput = { id: null }): ContattoItemFormGroup {
    const contattoItemRawValue = {
      ...this.getFormDefaults(),
      ...contattoItem,
    };
    return new FormGroup<ContattoItemFormGroupContent>({
      id: new FormControl(
        { value: contattoItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      tipo: new FormControl(contattoItemRawValue.tipo, {
        validators: [Validators.required],
      }),
      valore: new FormControl(contattoItemRawValue.valore, {
        validators: [Validators.required],
      }),
      etichetta: new FormControl(contattoItemRawValue.etichetta),
      ordine: new FormControl(contattoItemRawValue.ordine, {
        validators: [Validators.required, Validators.min(0)],
      }),
      lista: new FormControl(contattoItemRawValue.lista, {
        validators: [Validators.required],
      }),
    });
  }

  getContattoItem(form: ContattoItemFormGroup): IContattoItem | NewContattoItem {
    return form.getRawValue() as IContattoItem | NewContattoItem;
  }

  resetForm(form: ContattoItemFormGroup, contattoItem: ContattoItemFormGroupInput): void {
    const contattoItemRawValue = { ...this.getFormDefaults(), ...contattoItem };
    form.reset(
      {
        ...contattoItemRawValue,
        id: { value: contattoItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ContattoItemFormDefaults {
    return {
      id: null,
    };
  }
}
