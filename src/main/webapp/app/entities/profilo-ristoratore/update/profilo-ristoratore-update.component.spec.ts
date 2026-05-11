import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ProfiloRistoratoreService } from '../service/profilo-ristoratore.service';
import { IProfiloRistoratore } from '../profilo-ristoratore.model';
import { ProfiloRistoratoreFormService } from './profilo-ristoratore-form.service';

import { ProfiloRistoratoreUpdateComponent } from './profilo-ristoratore-update.component';

describe('ProfiloRistoratore Management Update Component', () => {
  let comp: ProfiloRistoratoreUpdateComponent;
  let fixture: ComponentFixture<ProfiloRistoratoreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let profiloRistoratoreFormService: ProfiloRistoratoreFormService;
  let profiloRistoratoreService: ProfiloRistoratoreService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfiloRistoratoreUpdateComponent],
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
      .overrideTemplate(ProfiloRistoratoreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfiloRistoratoreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profiloRistoratoreFormService = TestBed.inject(ProfiloRistoratoreFormService);
    profiloRistoratoreService = TestBed.inject(ProfiloRistoratoreService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call User query and add missing value', () => {
      const profiloRistoratore: IProfiloRistoratore = { id: 30431 };
      const user: IUser = { id: 3944 };
      profiloRistoratore.user = user;

      const userCollection: IUser[] = [{ id: 3944 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profiloRistoratore });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const profiloRistoratore: IProfiloRistoratore = { id: 30431 };
      const user: IUser = { id: 3944 };
      profiloRistoratore.user = user;

      activatedRoute.data = of({ profiloRistoratore });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContainEqual(user);
      expect(comp.profiloRistoratore).toEqual(profiloRistoratore);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfiloRistoratore>>();
      const profiloRistoratore = { id: 30942 };
      jest.spyOn(profiloRistoratoreFormService, 'getProfiloRistoratore').mockReturnValue(profiloRistoratore);
      jest.spyOn(profiloRistoratoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profiloRistoratore });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profiloRistoratore }));
      saveSubject.complete();

      // THEN
      expect(profiloRistoratoreFormService.getProfiloRistoratore).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(profiloRistoratoreService.update).toHaveBeenCalledWith(expect.objectContaining(profiloRistoratore));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfiloRistoratore>>();
      const profiloRistoratore = { id: 30942 };
      jest.spyOn(profiloRistoratoreFormService, 'getProfiloRistoratore').mockReturnValue({ id: null });
      jest.spyOn(profiloRistoratoreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profiloRistoratore: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profiloRistoratore }));
      saveSubject.complete();

      // THEN
      expect(profiloRistoratoreFormService.getProfiloRistoratore).toHaveBeenCalled();
      expect(profiloRistoratoreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfiloRistoratore>>();
      const profiloRistoratore = { id: 30942 };
      jest.spyOn(profiloRistoratoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profiloRistoratore });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profiloRistoratoreService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
