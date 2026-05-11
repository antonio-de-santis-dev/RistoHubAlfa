import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ListaContattiService } from '../service/lista-contatti.service';
import { IListaContatti } from '../lista-contatti.model';
import { ListaContattiFormService } from './lista-contatti-form.service';

import { ListaContattiUpdateComponent } from './lista-contatti-update.component';

describe('ListaContatti Management Update Component', () => {
  let comp: ListaContattiUpdateComponent;
  let fixture: ComponentFixture<ListaContattiUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let listaContattiFormService: ListaContattiFormService;
  let listaContattiService: ListaContattiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListaContattiUpdateComponent],
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
      .overrideTemplate(ListaContattiUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ListaContattiUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    listaContattiFormService = TestBed.inject(ListaContattiFormService);
    listaContattiService = TestBed.inject(ListaContattiService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const listaContatti: IListaContatti = { id: 13574 };

      activatedRoute.data = of({ listaContatti });
      comp.ngOnInit();

      expect(comp.listaContatti).toEqual(listaContatti);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListaContatti>>();
      const listaContatti = { id: 9791 };
      jest.spyOn(listaContattiFormService, 'getListaContatti').mockReturnValue(listaContatti);
      jest.spyOn(listaContattiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listaContatti });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: listaContatti }));
      saveSubject.complete();

      // THEN
      expect(listaContattiFormService.getListaContatti).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(listaContattiService.update).toHaveBeenCalledWith(expect.objectContaining(listaContatti));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListaContatti>>();
      const listaContatti = { id: 9791 };
      jest.spyOn(listaContattiFormService, 'getListaContatti').mockReturnValue({ id: null });
      jest.spyOn(listaContattiService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listaContatti: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: listaContatti }));
      saveSubject.complete();

      // THEN
      expect(listaContattiFormService.getListaContatti).toHaveBeenCalled();
      expect(listaContattiService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListaContatti>>();
      const listaContatti = { id: 9791 };
      jest.spyOn(listaContattiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listaContatti });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(listaContattiService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
