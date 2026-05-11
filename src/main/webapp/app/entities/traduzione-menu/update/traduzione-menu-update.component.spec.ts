import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { TraduzioneMenuService } from '../service/traduzione-menu.service';
import { ITraduzioneMenu } from '../traduzione-menu.model';
import { TraduzioneMenuFormService } from './traduzione-menu-form.service';

import { TraduzioneMenuUpdateComponent } from './traduzione-menu-update.component';

describe('TraduzioneMenu Management Update Component', () => {
  let comp: TraduzioneMenuUpdateComponent;
  let fixture: ComponentFixture<TraduzioneMenuUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let traduzioneMenuFormService: TraduzioneMenuFormService;
  let traduzioneMenuService: TraduzioneMenuService;
  let menuService: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TraduzioneMenuUpdateComponent],
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
      .overrideTemplate(TraduzioneMenuUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TraduzioneMenuUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    traduzioneMenuFormService = TestBed.inject(TraduzioneMenuFormService);
    traduzioneMenuService = TestBed.inject(TraduzioneMenuService);
    menuService = TestBed.inject(MenuService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Menu query and add missing value', () => {
      const traduzioneMenu: ITraduzioneMenu = { id: 12885 };
      const menu: IMenu = { id: 7656 };
      traduzioneMenu.menu = menu;

      const menuCollection: IMenu[] = [{ id: 7656 }];
      jest.spyOn(menuService, 'query').mockReturnValue(of(new HttpResponse({ body: menuCollection })));
      const additionalMenus = [menu];
      const expectedCollection: IMenu[] = [...additionalMenus, ...menuCollection];
      jest.spyOn(menuService, 'addMenuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ traduzioneMenu });
      comp.ngOnInit();

      expect(menuService.query).toHaveBeenCalled();
      expect(menuService.addMenuToCollectionIfMissing).toHaveBeenCalledWith(
        menuCollection,
        ...additionalMenus.map(expect.objectContaining),
      );
      expect(comp.menusSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const traduzioneMenu: ITraduzioneMenu = { id: 12885 };
      const menu: IMenu = { id: 7656 };
      traduzioneMenu.menu = menu;

      activatedRoute.data = of({ traduzioneMenu });
      comp.ngOnInit();

      expect(comp.menusSharedCollection).toContainEqual(menu);
      expect(comp.traduzioneMenu).toEqual(traduzioneMenu);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITraduzioneMenu>>();
      const traduzioneMenu = { id: 20490 };
      jest.spyOn(traduzioneMenuFormService, 'getTraduzioneMenu').mockReturnValue(traduzioneMenu);
      jest.spyOn(traduzioneMenuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ traduzioneMenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: traduzioneMenu }));
      saveSubject.complete();

      // THEN
      expect(traduzioneMenuFormService.getTraduzioneMenu).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(traduzioneMenuService.update).toHaveBeenCalledWith(expect.objectContaining(traduzioneMenu));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITraduzioneMenu>>();
      const traduzioneMenu = { id: 20490 };
      jest.spyOn(traduzioneMenuFormService, 'getTraduzioneMenu').mockReturnValue({ id: null });
      jest.spyOn(traduzioneMenuService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ traduzioneMenu: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: traduzioneMenu }));
      saveSubject.complete();

      // THEN
      expect(traduzioneMenuFormService.getTraduzioneMenu).toHaveBeenCalled();
      expect(traduzioneMenuService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITraduzioneMenu>>();
      const traduzioneMenu = { id: 20490 };
      jest.spyOn(traduzioneMenuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ traduzioneMenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(traduzioneMenuService.update).toHaveBeenCalled();
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
  });
});
