import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ListaContattiDetailComponent } from './lista-contatti-detail.component';

describe('ListaContatti Management Detail Component', () => {
  let comp: ListaContattiDetailComponent;
  let fixture: ComponentFixture<ListaContattiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaContattiDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./lista-contatti-detail.component').then(m => m.ListaContattiDetailComponent),
              resolve: { listaContatti: () => of({ id: 9791 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ListaContattiDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaContattiDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load listaContatti on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ListaContattiDetailComponent);

      // THEN
      expect(instance.listaContatti()).toEqual(expect.objectContaining({ id: 9791 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
