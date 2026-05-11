import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { TraduzioneMenuService } from '../service/traduzione-menu.service';
import { ITraduzioneMenu } from '../traduzione-menu.model';
import { TraduzioneMenuFormGroup, TraduzioneMenuFormService } from './traduzione-menu-form.service';

@Component({
  selector: 'jhi-traduzione-menu-update',
  templateUrl: './traduzione-menu-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TraduzioneMenuUpdateComponent implements OnInit {
  isSaving = false;
  traduzioneMenu: ITraduzioneMenu | null = null;

  menusSharedCollection: IMenu[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected traduzioneMenuService = inject(TraduzioneMenuService);
  protected traduzioneMenuFormService = inject(TraduzioneMenuFormService);
  protected menuService = inject(MenuService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TraduzioneMenuFormGroup = this.traduzioneMenuFormService.createTraduzioneMenuFormGroup();

  compareMenu = (o1: IMenu | null, o2: IMenu | null): boolean => this.menuService.compareMenu(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ traduzioneMenu }) => {
      this.traduzioneMenu = traduzioneMenu;
      if (traduzioneMenu) {
        this.updateForm(traduzioneMenu);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('ristoHubAlfaApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const traduzioneMenu = this.traduzioneMenuFormService.getTraduzioneMenu(this.editForm);
    if (traduzioneMenu.id !== null) {
      this.subscribeToSaveResponse(this.traduzioneMenuService.update(traduzioneMenu));
    } else {
      this.subscribeToSaveResponse(this.traduzioneMenuService.create(traduzioneMenu));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITraduzioneMenu>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(traduzioneMenu: ITraduzioneMenu): void {
    this.traduzioneMenu = traduzioneMenu;
    this.traduzioneMenuFormService.resetForm(this.editForm, traduzioneMenu);

    this.menusSharedCollection = this.menuService.addMenuToCollectionIfMissing<IMenu>(this.menusSharedCollection, traduzioneMenu.menu);
  }

  protected loadRelationshipsOptions(): void {
    this.menuService
      .query()
      .pipe(map((res: HttpResponse<IMenu[]>) => res.body ?? []))
      .pipe(map((menus: IMenu[]) => this.menuService.addMenuToCollectionIfMissing<IMenu>(menus, this.traduzioneMenu?.menu)))
      .subscribe((menus: IMenu[]) => (this.menusSharedCollection = menus));
  }
}
