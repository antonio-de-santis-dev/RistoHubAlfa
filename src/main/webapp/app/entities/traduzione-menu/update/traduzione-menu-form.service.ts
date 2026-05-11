import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITraduzioneMenu, NewTraduzioneMenu } from '../traduzione-menu.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITraduzioneMenu for edit and NewTraduzioneMenuFormGroupInput for create.
 */
type TraduzioneMenuFormGroupInput = ITraduzioneMenu | PartialWithRequiredKeyOf<NewTraduzioneMenu>;

type TraduzioneMenuFormDefaults = Pick<NewTraduzioneMenu, 'id' | 'modificata'>;

type TraduzioneMenuFormGroupContent = {
  id: FormControl<ITraduzioneMenu['id'] | NewTraduzioneMenu['id']>;
  lingua: FormControl<ITraduzioneMenu['lingua']>;
  contenutoJson: FormControl<ITraduzioneMenu['contenutoJson']>;
  modificata: FormControl<ITraduzioneMenu['modificata']>;
  menu: FormControl<ITraduzioneMenu['menu']>;
};

export type TraduzioneMenuFormGroup = FormGroup<TraduzioneMenuFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TraduzioneMenuFormService {
  createTraduzioneMenuFormGroup(traduzioneMenu: TraduzioneMenuFormGroupInput = { id: null }): TraduzioneMenuFormGroup {
    const traduzioneMenuRawValue = {
      ...this.getFormDefaults(),
      ...traduzioneMenu,
    };
    return new FormGroup<TraduzioneMenuFormGroupContent>({
      id: new FormControl(
        { value: traduzioneMenuRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      lingua: new FormControl(traduzioneMenuRawValue.lingua, {
        validators: [Validators.required, Validators.maxLength(5)],
      }),
      contenutoJson: new FormControl(traduzioneMenuRawValue.contenutoJson, {
        validators: [Validators.required],
      }),
      modificata: new FormControl(traduzioneMenuRawValue.modificata, {
        validators: [Validators.required],
      }),
      menu: new FormControl(traduzioneMenuRawValue.menu, {
        validators: [Validators.required],
      }),
    });
  }

  getTraduzioneMenu(form: TraduzioneMenuFormGroup): ITraduzioneMenu | NewTraduzioneMenu {
    return form.getRawValue() as ITraduzioneMenu | NewTraduzioneMenu;
  }

  resetForm(form: TraduzioneMenuFormGroup, traduzioneMenu: TraduzioneMenuFormGroupInput): void {
    const traduzioneMenuRawValue = { ...this.getFormDefaults(), ...traduzioneMenu };
    form.reset(
      {
        ...traduzioneMenuRawValue,
        id: { value: traduzioneMenuRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TraduzioneMenuFormDefaults {
    return {
      id: null,
      modificata: false,
    };
  }
}
