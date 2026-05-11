import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { IProdotto } from 'app/entities/prodotto/prodotto.model';
import { ProdottoService } from 'app/entities/prodotto/service/prodotto.service';
import { IPiattoDelGiorno } from '../piatto-del-giorno.model';
import { PiattoDelGiornoService } from '../service/piatto-del-giorno.service';
import { PiattoDelGiornoFormService } from './piatto-del-giorno-form.service';

import { PiattoDelGiornoUpdateComponent } from './piatto-del-giorno-update.component';

describe('PiattoDelGiorno Management Update Component', () => {
  let comp: PiattoDelGiornoUpdateComponent;
  let fixture: ComponentFixture<PiattoDelGiornoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let piattoDelGiornoFormService: PiattoDelGiornoFormService;
  let piattoDelGiornoService: PiattoDelGiornoService;
  let menuService: MenuService;
  let prodottoService: ProdottoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PiattoDelGiornoUpdateComponent],
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
      .overrideTemplate(PiattoDelGiornoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PiattoDelGiornoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    piattoDelGiornoFormService = TestBed.inject(PiattoDelGiornoFormService);
    piattoDelGiornoService = TestBed.inject(PiattoDelGiornoService);
    menuService = TestBed.inject(MenuService);
    prodottoService = TestBed.inject(ProdottoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Menu query and add missing value', () => {
      const piattoDelGiorno: IPiattoDelGiorno = { id: 2832 };
      const menu: IMenu = { id: 7656 };
      piattoDelGiorno.menu = menu;

      const menuCollection: IMenu[] = [{ id: 7656 }];
      jest.spyOn(menuService, 'query').mockReturnValue(of(new HttpResponse({ body: menuCollection })));
      const additionalMenus = [menu];
      const expectedCollection: IMenu[] = [...additionalMenus, ...menuCollection];
      jest.spyOn(menuService, 'addMenuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ piattoDelGiorno });
      comp.ngOnInit();

      expect(menuService.query).toHaveBeenCalled();
      expect(menuService.addMenuToCollectionIfMissing).toHaveBeenCalledWith(
        menuCollection,
        ...additionalMenus.map(expect.objectContaining),
      );
      expect(comp.menusSharedCollection).toEqual(expectedCollection);
    });

    it('should call Prodotto query and add missing value', () => {
      const piattoDelGiorno: IPiattoDelGiorno = { id: 2832 };
      const prodotto: IProdotto = { id: 544 };
      piattoDelGiorno.prodotto = prodotto;

      const prodottoCollection: IProdotto[] = [{ id: 544 }];
      jest.spyOn(prodottoService, 'query').mockReturnValue(of(new HttpResponse({ body: prodottoCollection })));
      const additionalProdottos = [prodotto];
      const expectedCollection: IProdotto[] = [...additionalProdottos, ...prodottoCollection];
      jest.spyOn(prodottoService, 'addProdottoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ piattoDelGiorno });
      comp.ngOnInit();

      expect(prodottoService.query).toHaveBeenCalled();
      expect(prodottoService.addProdottoToCollectionIfMissing).toHaveBeenCalledWith(
        prodottoCollection,
        ...additionalProdottos.map(expect.objectContaining),
      );
      expect(comp.prodottosSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const piattoDelGiorno: IPiattoDelGiorno = { id: 2832 };
      const menu: IMenu = { id: 7656 };
      piattoDelGiorno.menu = menu;
      const prodotto: IProdotto = { id: 544 };
      piattoDelGiorno.prodotto = prodotto;

      activatedRoute.data = of({ piattoDelGiorno });
      comp.ngOnInit();

      expect(comp.menusSharedCollection).toContainEqual(menu);
      expect(comp.prodottosSharedCollection).toContainEqual(prodotto);
      expect(comp.piattoDelGiorno).toEqual(piattoDelGiorno);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPiattoDelGiorno>>();
      const piattoDelGiorno = { id: 27244 };
      jest.spyOn(piattoDelGiornoFormService, 'getPiattoDelGiorno').mockReturnValue(piattoDelGiorno);
      jest.spyOn(piattoDelGiornoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ piattoDelGiorno });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: piattoDelGiorno }));
      saveSubject.complete();

      // THEN
      expect(piattoDelGiornoFormService.getPiattoDelGiorno).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(piattoDelGiornoService.update).toHaveBeenCalledWith(expect.objectContaining(piattoDelGiorno));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPiattoDelGiorno>>();
      const piattoDelGiorno = { id: 27244 };
      jest.spyOn(piattoDelGiornoFormService, 'getPiattoDelGiorno').mockReturnValue({ id: null });
      jest.spyOn(piattoDelGiornoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ piattoDelGiorno: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: piattoDelGiorno }));
      saveSubject.complete();

      // THEN
      expect(piattoDelGiornoFormService.getPiattoDelGiorno).toHaveBeenCalled();
      expect(piattoDelGiornoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPiattoDelGiorno>>();
      const piattoDelGiorno = { id: 27244 };
      jest.spyOn(piattoDelGiornoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ piattoDelGiorno });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(piattoDelGiornoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMenu', () => {
      it('should forward to menuService', () => {
        const entity = { id: 7656 };
        const entity2 = { id: 2859 };
        jest.spyOn(menuService, 'compareMenu');
        comp.compareMenu(entity, entity2);
        expect(menuService.compareMenu).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
