import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAllergene, NewAllergene } from '../allergene.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAllergene for edit and NewAllergeneFormGroupInput for create.
 */
type AllergeneFormGroupInput = IAllergene | PartialWithRequiredKeyOf<NewAllergene>;

type AllergeneFormDefaults = Pick<NewAllergene, 'id' | 'prodottis'>;

type AllergeneFormGroupContent = {
  id: FormControl<IAllergene['id'] | NewAllergene['id']>;
  nome: FormControl<IAllergene['nome']>;
  tipo: FormControl<IAllergene['tipo']>;
  nomeDefault: FormControl<IAllergene['nomeDefault']>;
  prodottis: FormControl<IAllergene['prodottis']>;
};

export type AllergeneFormGroup = FormGroup<AllergeneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AllergeneFormService {
  createAllergeneFormGroup(allergene: AllergeneFormGroupInput = { id: null }): AllergeneFormGroup {
    const allergeneRawValue = {
      ...this.getFormDefaults(),
      ...allergene,
    };
    return new FormGroup<AllergeneFormGroupContent>({
      id: new FormControl(
        { value: allergeneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(allergeneRawValue.nome, {
        validators: [Validators.required],
      }),
      tipo: new FormControl(allergeneRawValue.tipo, {
        validators: [Validators.required],
      }),
      nomeDefault: new FormControl(allergeneRawValue.nomeDefault),
      prodottis: new FormControl(allergeneRawValue.prodottis ?? []),
    });
  }

  getAllergene(form: AllergeneFormGroup): IAllergene | NewAllergene {
    return form.getRawValue() as IAllergene | NewAllergene;
  }

  resetForm(form: AllergeneFormGroup, allergene: AllergeneFormGroupInput): void {
    const allergeneRawValue = { ...this.getFormDefaults(), ...allergene };
    form.reset(
      {
        ...allergeneRawValue,
        id: { value: allergeneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AllergeneFormDefaults {
    return {
      id: null,
      prodottis: [],
    };
  }
}
