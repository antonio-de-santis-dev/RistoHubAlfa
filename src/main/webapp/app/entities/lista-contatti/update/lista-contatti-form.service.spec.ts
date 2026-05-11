import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../lista-contatti.test-samples';

import { ListaContattiFormService } from './lista-contatti-form.service';

describe('ListaContatti Form Service', () => {
  let service: ListaContattiFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaContattiFormService);
  });

  describe('Service methods', () => {
    describe('createListaContattiFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createListaContattiFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            note: expect.any(Object),
          }),
        );
      });

      it('passing IListaContatti should create a new form with FormGroup', () => {
        const formGroup = service.createListaContattiFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            note: expect.any(Object),
          }),
        );
      });
    });

    describe('getListaContatti', () => {
      it('should return NewListaContatti for default ListaContatti initial value', () => {
        const formGroup = service.createListaContattiFormGroup(sampleWithNewData);

        const listaContatti = service.getListaContatti(formGroup) as any;

        expect(listaContatti).toMatchObject(sampleWithNewData);
      });

      it('should return NewListaContatti for empty ListaContatti initial value', () => {
        const formGroup = service.createListaContattiFormGroup();

        const listaContatti = service.getListaContatti(formGroup) as any;

        expect(listaContatti).toMatchObject({});
      });

      it('should return IListaContatti', () => {
        const formGroup = service.createListaContattiFormGroup(sampleWithRequiredData);

        const listaContatti = service.getListaContatti(formGroup) as any;

        expect(listaContatti).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IListaContatti should not enable id FormControl', () => {
        const formGroup = service.createListaContattiFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewListaContatti should disable id FormControl', () => {
        const formGroup = service.createListaContattiFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
