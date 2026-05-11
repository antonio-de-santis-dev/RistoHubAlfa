import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IProfiloRistoratore } from '../profilo-ristoratore.model';

@Component({
  selector: 'jhi-profilo-ristoratore-detail',
  templateUrl: './profilo-ristoratore-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ProfiloRistoratoreDetailComponent {
  profiloRistoratore = input<IProfiloRistoratore | null>(null);

  previousState(): void {
    window.history.back();
  }
}
