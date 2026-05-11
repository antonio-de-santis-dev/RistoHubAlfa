import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../traduzione-menu.test-samples';

import { TraduzioneMenuFormService } from './traduzione-menu-form.service';

describe('TraduzioneMenu Form Service', () => {
  let service: TraduzioneMenuFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraduzioneMenuFormService);
  });

  describe('Service methods', () => {
    describe('createTraduzioneMenuFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTraduzioneMenuFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lingua: expect.any(Object),
            contenutoJson: expect.any(Object),
            modificata: expect.any(Object),
            menu: expect.any(Object),
          }),
        );
      });

      it('passing ITraduzioneMenu should create a new form with FormGroup', () => {
        const formGroup = service.createTraduzioneMenuFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lingua: expect.any(Object),
            contenutoJson: expect.any(Object),
            modificata: expect.any(Object),
            menu: expect.any(Object),
          }),
        );
      });
    });

    describe('getTraduzioneMenu', () => {
      it('should return NewTraduzioneMenu for default TraduzioneMenu initial value', () => {
        const formGroup = service.createTraduzioneMenuFormGroup(sampleWithNewData);

        const traduzioneMenu = service.getTraduzioneMenu(formGroup) as any;

        expect(traduzioneMenu).toMatchObject(sampleWithNewData);
      });

      it('should return NewTraduzioneMenu for empty TraduzioneMenu initial value', () => {
        const formGroup = service.createTraduzioneMenuFormGroup();

        const traduzioneMenu = service.getTraduzioneMenu(formGroup) as any;

        expect(traduzioneMenu).toMatchObject({});
      });

      it('should return ITraduzioneMenu', () => {
        const formGroup = service.createTraduzioneMenuFormGroup(sampleWithRequiredData);

        const traduzioneMenu = service.getTraduzioneMenu(formGroup) as any;

        expect(traduzioneMenu).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITraduzioneMenu should not enable id FormControl', () => {
        const formGroup = service.createTraduzioneMenuFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTraduzioneMenu should disable id FormControl', () => {
        const formGroup = service.createTraduzioneMenuFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
