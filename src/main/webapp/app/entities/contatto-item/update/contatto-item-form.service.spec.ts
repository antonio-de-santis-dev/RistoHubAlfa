import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../contatto-item.test-samples';

import { ContattoItemFormService } from './contatto-item-form.service';

describe('ContattoItem Form Service', () => {
  let service: ContattoItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContattoItemFormService);
  });

  describe('Service methods', () => {
    describe('createContattoItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createContattoItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipo: expect.any(Object),
            valore: expect.any(Object),
            etichetta: expect.any(Object),
            ordine: expect.any(Object),
            lista: expect.any(Object),
          }),
        );
      });

      it('passing IContattoItem should create a new form with FormGroup', () => {
        const formGroup = service.createContattoItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipo: expect.any(Object),
            valore: expect.any(Object),
            etichetta: expect.any(Object),
            ordine: expect.any(Object),
            lista: expect.any(Object),
          }),
        );
      });
    });

    describe('getContattoItem', () => {
      it('should return NewContattoItem for default ContattoItem initial value', () => {
        const formGroup = service.createContattoItemFormGroup(sampleWithNewData);

        const contattoItem = service.getContattoItem(formGroup) as any;

        expect(contattoItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewContattoItem for empty ContattoItem initial value', () => {
        const formGroup = service.createContattoItemFormGroup();

        const contattoItem = service.getContattoItem(formGroup) as any;

        expect(contattoItem).toMatchObject({});
      });

      it('should return IContattoItem', () => {
        const formGroup = service.createContattoItemFormGroup(sampleWithRequiredData);

        const contattoItem = service.getContattoItem(formGroup) as any;

        expect(contattoItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IContattoItem should not enable id FormControl', () => {
        const formGroup = service.createContattoItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewContattoItem should disable id FormControl', () => {
        const formGroup = service.createContattoItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
