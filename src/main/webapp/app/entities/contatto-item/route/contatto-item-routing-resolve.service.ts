import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IContattoItem } from '../contatto-item.model';
import { ContattoItemService } from '../service/contatto-item.service';

const contattoItemResolve = (route: ActivatedRouteSnapshot): Observable<null | IContattoItem> => {
  const id = route.params.id;
  if (id) {
    return inject(ContattoItemService)
      .find(id)
      .pipe(
        mergeMap((contattoItem: HttpResponse<IContattoItem>) => {
          if (contattoItem.body) {
            return of(contattoItem.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default contattoItemResolve;
