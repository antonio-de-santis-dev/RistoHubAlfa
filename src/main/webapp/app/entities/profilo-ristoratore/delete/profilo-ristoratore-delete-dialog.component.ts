import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProfiloRistoratore } from '../profilo-ristoratore.model';
import { ProfiloRistoratoreService } from '../service/profilo-ristoratore.service';

@Component({
  templateUrl: './profilo-ristoratore-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProfiloRistoratoreDeleteDialogComponent {
  profiloRistoratore?: IProfiloRistoratore;

  protected profiloRistoratoreService = inject(ProfiloRistoratoreService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.profiloRistoratoreService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
