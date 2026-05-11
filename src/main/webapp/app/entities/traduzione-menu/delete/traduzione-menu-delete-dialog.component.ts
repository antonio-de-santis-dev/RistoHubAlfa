import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITraduzioneMenu } from '../traduzione-menu.model';
import { TraduzioneMenuService } from '../service/traduzione-menu.service';

@Component({
  templateUrl: './traduzione-menu-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TraduzioneMenuDeleteDialogComponent {
  traduzioneMenu?: ITraduzioneMenu;

  protected traduzioneMenuService = inject(TraduzioneMenuService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.traduzioneMenuService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
