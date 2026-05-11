import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IListaContatti } from '../lista-contatti.model';
import { ListaContattiService } from '../service/lista-contatti.service';

@Component({
  templateUrl: './lista-contatti-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ListaContattiDeleteDialogComponent {
  listaContatti?: IListaContatti;

  protected listaContattiService = inject(ListaContattiService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.listaContattiService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
