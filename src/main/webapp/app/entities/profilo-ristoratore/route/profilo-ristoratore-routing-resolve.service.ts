import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfiloRistoratore } from '../profilo-ristoratore.model';
import { ProfiloRistoratoreService } from '../service/profilo-ristoratore.service';

const profiloRistoratoreResolve = (route: ActivatedRouteSnapshot): Observable<null | IProfiloRistoratore> => {
  const id = route.params.id;
  if (id) {
    return inject(ProfiloRistoratoreService)
      .find(id)
      .pipe(
        mergeMap((profiloRistoratore: HttpResponse<IProfiloRistoratore>) => {
          if (profiloRistoratore.body) {
            return of(profiloRistoratore.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default profiloRistoratoreResolve;
