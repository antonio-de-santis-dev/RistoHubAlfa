import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IContattoItem } from '../contatto-item.model';

@Component({
  selector: 'jhi-contatto-item-detail',
  templateUrl: './contatto-item-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ContattoItemDetailComponent {
  contattoItem = input<IContattoItem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
