import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProdotto } from 'app/entities/prodotto/prodotto.model';
import { ProdottoService } from 'app/entities/prodotto/service/prodotto.service';
import { AllergeneService } from '../service/allergene.service';
import { IAllergene } from '../allergene.model';
import { AllergeneFormService } from './allergene-form.service';

import { AllergeneUpdateComponent } from './allergene-update.component';

describe('Allergene Management Update Component', () => {
  let comp: AllergeneUpdateComponent;
  let fixture: ComponentFixture<AllergeneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let allergeneFormService: AllergeneFormService;
  let allergeneService: AllergeneService;
  let prodottoService: ProdottoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AllergeneUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AllergeneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AllergeneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    allergeneFormService = TestBed.inject(AllergeneFormService);
    allergeneService = TestBed.inject(AllergeneService);
    prodottoService = TestBed.inject(ProdottoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Prodotto query and add missing value', () => {
      const allergene: IAllergene = { id: 10620 };
      const prodottis: IProdotto[] = [{ id: 544 }];
      allergene.prodottis = prodottis;

      const prodottoCollection: IProdotto[] = [{ id: 544 }];
      jest.spyOn(prodottoService, 'query').mockReturnValue(of(new HttpResponse({ body: prodottoCollection })));
      const additionalProdottos = [...prodottis];
      const expectedCollection: IProdotto[] = [...additionalProdottos, ...prodottoCollection];
      jest.spyOn(prodottoService, 'addProdottoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ allergene });
      comp.ngOnInit();

      expect(prodottoService.query).toHaveBeenCalled();
      expect(prodottoService.addProdottoToCollectionIfMissing).toHaveBeenCalledWith(
        prodottoCollection,
        ...additionalProdottos.map(expect.objectContaining),
      );
      expect(comp.prodottosSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const allergene: IAllergene = { id: 10620 };
      const prodotti: IProdotto = { id: 544 };
      allergene.prodottis = [prodotti];

      activatedRoute.data = of({ allergene });
      comp.ngOnInit();

      expect(comp.prodottosSharedCollection).toContainEqual(prodotti);
      expect(comp.allergene).toEqual(allergene);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllergene>>();
      const allergene = { id: 7644 };
      jest.spyOn(allergeneFormService, 'getAllergene').mockReturnValue(allergene);
      jest.spyOn(allergeneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allergene });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: allergene }));
      saveSubject.complete();

      // THEN
      expect(allergeneFormService.getAllergene).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(allergeneService.update).toHaveBeenCalledWith(expect.objectContaining(allergene));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllergene>>();
      const allergene = { id: 7644 };
      jest.spyOn(allergeneFormService, 'getAllergene').mockReturnValue({ id: null });
      jest.spyOn(allergeneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allergene: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: allergene }));
      saveSubject.complete();

      // THEN
      expect(allergeneFormService.getAllergene).toHaveBeenCalled();
      expect(allergeneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllergene>>();
      const allergene = { id: 7644 };
      jest.spyOn(allergeneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allergene });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(allergeneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProdotto', () => {
      it('should forward to prodottoService', () => {
        const entity = { id: 544 };
        const entity2 = { id: 29716 };
        jest.spyOn(prodottoService, 'compareProdotto');
        comp.compareProdotto(entity, entity2);
        expect(prodottoService.compareProdotto).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
