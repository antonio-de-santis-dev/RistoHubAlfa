import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../profilo-ristoratore.test-samples';

import { ProfiloRistoratoreFormService } from './profilo-ristoratore-form.service';

describe('ProfiloRistoratore Form Service', () => {
  let service: ProfiloRistoratoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfiloRistoratoreFormService);
  });

  describe('Service methods', () => {
    describe('createProfiloRistoratoreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProfiloRistoratoreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            livello: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IProfiloRistoratore should create a new form with FormGroup', () => {
        const formGroup = service.createProfiloRistoratoreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            livello: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getProfiloRistoratore', () => {
      it('should return NewProfiloRistoratore for default ProfiloRistoratore initial value', () => {
        const formGroup = service.createProfiloRistoratoreFormGroup(sampleWithNewData);

        const profiloRistoratore = service.getProfiloRistoratore(formGroup) as any;

        expect(profiloRistoratore).toMatchObject(sampleWithNewData);
      });

      it('should return NewProfiloRistoratore for empty ProfiloRistoratore initial value', () => {
        const formGroup = service.createProfiloRistoratoreFormGroup();

        const profiloRistoratore = service.getProfiloRistoratore(formGroup) as any;

        expect(profiloRistoratore).toMatchObject({});
      });

      it('should return IProfiloRistoratore', () => {
        const formGroup = service.createProfiloRistoratoreFormGroup(sampleWithRequiredData);

        const profiloRistoratore = service.getProfiloRistoratore(formGroup) as any;

        expect(profiloRistoratore).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProfiloRistoratore should not enable id FormControl', () => {
        const formGroup = service.createProfiloRistoratoreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProfiloRistoratore should disable id FormControl', () => {
        const formGroup = service.createProfiloRistoratoreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
