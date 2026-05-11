import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ContattoItemDetailComponent } from './contatto-item-detail.component';

describe('ContattoItem Management Detail Component', () => {
  let comp: ContattoItemDetailComponent;
  let fixture: ComponentFixture<ContattoItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContattoItemDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./contatto-item-detail.component').then(m => m.ContattoItemDetailComponent),
              resolve: { contattoItem: () => of({ id: 13358 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ContattoItemDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContattoItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load contattoItem on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ContattoItemDetailComponent);

      // THEN
      expect(instance.contattoItem()).toEqual(expect.objectContaining({ id: 13358 }));
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
