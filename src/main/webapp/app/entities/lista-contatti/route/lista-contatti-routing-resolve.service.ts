import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IListaContatti } from '../lista-contatti.model';
import { ListaContattiService } from '../service/lista-contatti.service';

const listaContattiResolve = (route: ActivatedRouteSnapshot): Observable<null | IListaContatti> => {
  const id = route.params.id;
  if (id) {
    return inject(ListaContattiService)
      .find(id)
      .pipe(
        mergeMap((listaContatti: HttpResponse<IListaContatti>) => {
          if (listaContatti.body) {
            return of(listaContatti.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default listaContattiResolve;
