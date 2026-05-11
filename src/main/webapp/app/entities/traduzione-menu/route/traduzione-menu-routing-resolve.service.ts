import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITraduzioneMenu } from '../traduzione-menu.model';
import { TraduzioneMenuService } from '../service/traduzione-menu.service';

const traduzioneMenuResolve = (route: ActivatedRouteSnapshot): Observable<null | ITraduzioneMenu> => {
  const id = route.params.id;
  if (id) {
    return inject(TraduzioneMenuService)
      .find(id)
      .pipe(
        mergeMap((traduzioneMenu: HttpResponse<ITraduzioneMenu>) => {
          if (traduzioneMenu.body) {
            return of(traduzioneMenu.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default traduzioneMenuResolve;
