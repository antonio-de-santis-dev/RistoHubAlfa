import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IListaContatti } from '../lista-contatti.model';

@Component({
  selector: 'jhi-lista-contatti-detail',
  templateUrl: './lista-contatti-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ListaContattiDetailComponent {
  listaContatti = input<IListaContatti | null>(null);

  previousState(): void {
    window.history.back();
  }
}
