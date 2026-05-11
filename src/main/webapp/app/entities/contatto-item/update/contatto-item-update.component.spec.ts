import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IListaContatti } from 'app/entities/lista-contatti/lista-contatti.model';
import { ListaContattiService } from 'app/entities/lista-contatti/service/lista-contatti.service';
import { ContattoItemService } from '../service/contatto-item.service';
import { IContattoItem } from '../contatto-item.model';
import { ContattoItemFormService } from './contatto-item-form.service';

import { ContattoItemUpdateComponent } from './contatto-item-update.component';

describe('ContattoItem Management Update Component', () => {
  let comp: ContattoItemUpdateComponent;
  let fixture: ComponentFixture<ContattoItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contattoItemFormService: ContattoItemFormService;
  let contattoItemService: ContattoItemService;
  let listaContattiService: ListaContattiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContattoItemUpdateComponent],
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
      .overrideTemplate(ContattoItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContattoItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contattoItemFormService = TestBed.inject(ContattoItemFormService);
    contattoItemService = TestBed.inject(ContattoItemService);
    listaContattiService = TestBed.inject(ListaContattiService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call ListaContatti query and add missing value', () => {
      const contattoItem: IContattoItem = { id: 26836 };
      const lista: IListaContatti = { id: 9791 };
      contattoItem.lista = lista;

      const listaContattiCollection: IListaContatti[] = [{ id: 9791 }];
      jest.spyOn(listaContattiService, 'query').mockReturnValue(of(new HttpResponse({ body: listaContattiCollection })));
      const additionalListaContattis = [lista];
      const expectedCollection: IListaContatti[] = [...additionalListaContattis, ...listaContattiCollection];
      jest.spyOn(listaContattiService, 'addListaContattiToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contattoItem });
      comp.ngOnInit();

      expect(listaContattiService.query).toHaveBeenCalled();
      expect(listaContattiService.addListaContattiToCollectionIfMissing).toHaveBeenCalledWith(
        listaContattiCollection,
        ...additionalListaContattis.map(expect.objectContaining),
      );
      expect(comp.listaContattisSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const contattoItem: IContattoItem = { id: 26836 };
      const lista: IListaContatti = { id: 9791 };
      contattoItem.lista = lista;

      activatedRoute.data = of({ contattoItem });
      comp.ngOnInit();

      expect(comp.listaContattisSharedCollection).toContainEqual(lista);
      expect(comp.contattoItem).toEqual(contattoItem);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContattoItem>>();
      const contattoItem = { id: 13358 };
      jest.spyOn(contattoItemFormService, 'getContattoItem').mockReturnValue(contattoItem);
      jest.spyOn(contattoItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contattoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contattoItem }));
      saveSubject.complete();

      // THEN
      expect(contattoItemFormService.getContattoItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(contattoItemService.update).toHaveBeenCalledWith(expect.objectContaining(contattoItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContattoItem>>();
      const contattoItem = { id: 13358 };
      jest.spyOn(contattoItemFormService, 'getContattoItem').mockReturnValue({ id: null });
      jest.spyOn(contattoItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contattoItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contattoItem }));
      saveSubject.complete();

      // THEN
      expect(contattoItemFormService.getContattoItem).toHaveBeenCalled();
      expect(contattoItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContattoItem>>();
      const contattoItem = { id: 13358 };
      jest.spyOn(contattoItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contattoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contattoItemService.update).toHaveBeenCalled();
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
  });
});
