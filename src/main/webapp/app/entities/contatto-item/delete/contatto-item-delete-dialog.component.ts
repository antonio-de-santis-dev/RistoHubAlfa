import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IContattoItem } from '../contatto-item.model';
import { ContattoItemService } from '../service/contatto-item.service';

@Component({
  templateUrl: './contatto-item-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ContattoItemDeleteDialogComponent {
  contattoItem?: IContattoItem;

  protected contattoItemService = inject(ContattoItemService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contattoItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
