import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IListaContatti } from 'app/entities/lista-contatti/lista-contatti.model';
import { ListaContattiService } from 'app/entities/lista-contatti/service/lista-contatti.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IMenu } from '../menu.model';
import { MenuService } from '../service/menu.service';
import { MenuFormService } from './menu-form.service';

import { MenuUpdateComponent } from './menu-update.component';

describe('Menu Management Update Component', () => {
  let comp: MenuUpdateComponent;
  let fixture: ComponentFixture<MenuUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let menuFormService: MenuFormService;
  let menuService: MenuService;
  let listaContattiService: ListaContattiService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuUpdateComponent],
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
      .overrideTemplate(MenuUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MenuUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    menuFormService = TestBed.inject(MenuFormService);
    menuService = TestBed.inject(MenuService);
    listaContattiService = TestBed.inject(ListaContattiService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call contatti query and add missing value', () => {
      const menu: IMenu = { id: 2859 };
      const contatti: IListaContatti = { id: 9791 };
      menu.contatti = contatti;

      const contattiCollection: IListaContatti[] = [{ id: 9791 }];
      jest.spyOn(listaContattiService, 'query').mockReturnValue(of(new HttpResponse({ body: contattiCollection })));
      const expectedCollection: IListaContatti[] = [contatti, ...contattiCollection];
      jest.spyOn(listaContattiService, 'addListaContattiToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ menu });
      comp.ngOnInit();

      expect(listaContattiService.query).toHaveBeenCalled();
      expect(listaContattiService.addListaContattiToCollectionIfMissing).toHaveBeenCalledWith(contattiCollection, contatti);
      expect(comp.contattisCollection).toEqual(expectedCollection);
    });

    it('should call User query and add missing value', () => {
      const menu: IMenu = { id: 2859 };
      const ristoratore: IUser = { id: 3944 };
      menu.ristoratore = ristoratore;

      const userCollection: IUser[] = [{ id: 3944 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [ristoratore];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ menu });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const menu: IMenu = { id: 2859 };
      const contatti: IListaContatti = { id: 9791 };
      menu.contatti = contatti;
      const ristoratore: IUser = { id: 3944 };
      menu.ristoratore = ristoratore;

      activatedRoute.data = of({ menu });
      comp.ngOnInit();

      expect(comp.contattisCollection).toContainEqual(contatti);
      expect(comp.usersSharedCollection).toContainEqual(ristoratore);
      expect(comp.menu).toEqual(menu);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMenu>>();
      const menu = { id: 7656 };
      jest.spyOn(menuFormService, 'getMenu').mockReturnValue(menu);
      jest.spyOn(menuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ menu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: menu }));
      saveSubject.complete();

      // THEN
      expect(menuFormService.getMenu).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(menuService.update).toHaveBeenCalledWith(expect.objectContaining(menu));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMenu>>();
      const menu = { id: 7656 };
      jest.spyOn(menuFormService, 'getMenu').mockReturnValue({ id: null });
      jest.spyOn(menuService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ menu: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: menu }));
      saveSubject.complete();

      // THEN
      expect(menuFormService.getMenu).toHaveBeenCalled();
      expect(menuService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMenu>>();
      const menu = { id: 7656 };
      jest.spyOn(menuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ menu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(menuService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareListaContatti', () => {
      it('should forward to listaContattiService', () => {
        const entity = { id: 9791 };
        const entity2 = { id: 13574 };
        jest.spyOn(listaContattiService, 'compareListaContatti');
        comp.compareListaContatti(entity, entity2);
        expect(listaContattiService.compareListaContatti).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
