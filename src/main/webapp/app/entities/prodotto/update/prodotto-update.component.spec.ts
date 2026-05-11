import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAllergene } from 'app/entities/allergene/allergene.model';
import { AllergeneService } from 'app/entities/allergene/service/allergene.service';
import { IPortata } from 'app/entities/portata/portata.model';
import { PortataService } from 'app/entities/portata/service/portata.service';
import { IProdotto } from '../prodotto.model';
import { ProdottoService } from '../service/prodotto.service';
import { ProdottoFormService } from './prodotto-form.service';

import { ProdottoUpdateComponent } from './prodotto-update.component';

describe('Prodotto Management Update Component', () => {
  let comp: ProdottoUpdateComponent;
  let fixture: ComponentFixture<ProdottoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let prodottoFormService: ProdottoFormService;
  let prodottoService: ProdottoService;
  let allergeneService: AllergeneService;
  let portataService: PortataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProdottoUpdateComponent],
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
      .overrideTemplate(ProdottoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProdottoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    prodottoFormService = TestBed.inject(ProdottoFormService);
    prodottoService = TestBed.inject(ProdottoService);
    allergeneService = TestBed.inject(AllergeneService);
    portataService = TestBed.inject(PortataService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Allergene query and add missing value', () => {
      const prodotto: IProdotto = { id: 29716 };
      const allergenis: IAllergene[] = [{ id: 7644 }];
      prodotto.allergenis = allergenis;

      const allergeneCollection: IAllergene[] = [{ id: 7644 }];
      jest.spyOn(allergeneService, 'query').mockReturnValue(of(new HttpResponse({ body: allergeneCollection })));
      const additionalAllergenes = [...allergenis];
      const expectedCollection: IAllergene[] = [...additionalAllergenes, ...allergeneCollection];
      jest.spyOn(allergeneService, 'addAllergeneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      expect(allergeneService.query).toHaveBeenCalled();
      expect(allergeneService.addAllergeneToCollectionIfMissing).toHaveBeenCalledWith(
        allergeneCollection,
        ...additionalAllergenes.map(expect.objectContaining),
      );
      expect(comp.allergenesSharedCollection).toEqual(expectedCollection);
    });

    it('should call Portata query and add missing value', () => {
      const prodotto: IProdotto = { id: 29716 };
      const portata: IPortata = { id: 11650 };
      prodotto.portata = portata;

      const portataCollection: IPortata[] = [{ id: 11650 }];
      jest.spyOn(portataService, 'query').mockReturnValue(of(new HttpResponse({ body: portataCollection })));
      const additionalPortatas = [portata];
      const expectedCollection: IPortata[] = [...additionalPortatas, ...portataCollection];
      jest.spyOn(portataService, 'addPortataToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      expect(portataService.query).toHaveBeenCalled();
      expect(portataService.addPortataToCollectionIfMissing).toHaveBeenCalledWith(
        portataCollection,
        ...additionalPortatas.map(expect.objectContaining),
      );
      expect(comp.portatasSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const prodotto: IProdotto = { id: 29716 };
      const allergeni: IAllergene = { id: 7644 };
      prodotto.allergenis = [allergeni];
      const portata: IPortata = { id: 11650 };
      prodotto.portata = portata;

      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      expect(comp.allergenesSharedCollection).toContainEqual(allergeni);
      expect(comp.portatasSharedCollection).toContainEqual(portata);
      expect(comp.prodotto).toEqual(prodotto);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdotto>>();
      const prodotto = { id: 544 };
      jest.spyOn(prodottoFormService, 'getProdotto').mockReturnValue(prodotto);
      jest.spyOn(prodottoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prodotto }));
      saveSubject.complete();

      // THEN
      expect(prodottoFormService.getProdotto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(prodottoService.update).toHaveBeenCalledWith(expect.objectContaining(prodotto));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdotto>>();
      const prodotto = { id: 544 };
      jest.spyOn(prodottoFormService, 'getProdotto').mockReturnValue({ id: null });
      jest.spyOn(prodottoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodotto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prodotto }));
      saveSubject.complete();

      // THEN
      expect(prodottoFormService.getProdotto).toHaveBeenCalled();
      expect(prodottoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdotto>>();
      const prodotto = { id: 544 };
      jest.spyOn(prodottoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(prodottoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAllergene', () => {
      it('should forward to allergeneService', () => {
        const entity = { id: 7644 };
        const entity2 = { id: 10620 };
        jest.spyOn(allergeneService, 'compareAllergene');
        comp.compareAllergene(entity, entity2);
        expect(allergeneService.compareAllergene).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePortata', () => {
      it('should forward to portataService', () => {
        const entity = { id: 11650 };
        const entity2 = { id: 25294 };
        jest.spyOn(portataService, 'comparePortata');
        comp.comparePortata(entity, entity2);
        expect(portataService.comparePortata).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
