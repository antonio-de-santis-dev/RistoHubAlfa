import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IProfiloRistoratore, NewProfiloRistoratore } from '../profilo-ristoratore.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProfiloRistoratore for edit and NewProfiloRistoratoreFormGroupInput for create.
 */
type ProfiloRistoratoreFormGroupInput = IProfiloRistoratore | PartialWithRequiredKeyOf<NewProfiloRistoratore>;

type ProfiloRistoratoreFormDefaults = Pick<NewProfiloRistoratore, 'id'>;

type ProfiloRistoratoreFormGroupContent = {
  id: FormControl<IProfiloRistoratore['id'] | NewProfiloRistoratore['id']>;
  livello: FormControl<IProfiloRistoratore['livello']>;
  user: FormControl<IProfiloRistoratore['user']>;
};

export type ProfiloRistoratoreFormGroup = FormGroup<ProfiloRistoratoreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProfiloRistoratoreFormService {
  createProfiloRistoratoreFormGroup(profiloRistoratore: ProfiloRistoratoreFormGroupInput = { id: null }): ProfiloRistoratoreFormGroup {
    const profiloRistoratoreRawValue = {
      ...this.getFormDefaults(),
      ...profiloRistoratore,
    };
    return new FormGroup<ProfiloRistoratoreFormGroupContent>({
      id: new FormControl(
        { value: profiloRistoratoreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      livello: new FormControl(profiloRistoratoreRawValue.livello, {
        validators: [Validators.required],
      }),
      user: new FormControl(profiloRistoratoreRawValue.user, {
        validators: [Validators.required],
      }),
    });
  }

  getProfiloRistoratore(form: ProfiloRistoratoreFormGroup): IProfiloRistoratore | NewProfiloRistoratore {
    return form.getRawValue() as IProfiloRistoratore | NewProfiloRistoratore;
  }

  resetForm(form: ProfiloRistoratoreFormGroup, profiloRistoratore: ProfiloRistoratoreFormGroupInput): void {
    const profiloRistoratoreRawValue = { ...this.getFormDefaults(), ...profiloRistoratore };
    form.reset(
      {
        ...profiloRistoratoreRawValue,
        id: { value: profiloRistoratoreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProfiloRistoratoreFormDefaults {
    return {
      id: null,
    };
  }
}
