import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProfiloRistoratoreDetailComponent } from './profilo-ristoratore-detail.component';

describe('ProfiloRistoratore Management Detail Component', () => {
  let comp: ProfiloRistoratoreDetailComponent;
  let fixture: ComponentFixture<ProfiloRistoratoreDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfiloRistoratoreDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./profilo-ristoratore-detail.component').then(m => m.ProfiloRistoratoreDetailComponent),
              resolve: { profiloRistoratore: () => of({ id: 30942 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProfiloRistoratoreDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiloRistoratoreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load profiloRistoratore on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProfiloRistoratoreDetailComponent);

      // THEN
      expect(instance.profiloRistoratore()).toEqual(expect.objectContaining({ id: 30942 }));
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
