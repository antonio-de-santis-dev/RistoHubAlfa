import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfiloRistoratore, NewProfiloRistoratore } from '../profilo-ristoratore.model';

export type PartialUpdateProfiloRistoratore = Partial<IProfiloRistoratore> & Pick<IProfiloRistoratore, 'id'>;

export type EntityResponseType = HttpResponse<IProfiloRistoratore>;
export type EntityArrayResponseType = HttpResponse<IProfiloRistoratore[]>;

@Injectable({ providedIn: 'root' })
export class ProfiloRistoratoreService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/profilo-ristoratores');

  create(profiloRistoratore: NewProfiloRistoratore): Observable<EntityResponseType> {
    return this.http.post<IProfiloRistoratore>(this.resourceUrl, profiloRistoratore, { observe: 'response' });
  }

  update(profiloRistoratore: IProfiloRistoratore): Observable<EntityResponseType> {
    return this.http.put<IProfiloRistoratore>(
      `${this.resourceUrl}/${this.getProfiloRistoratoreIdentifier(profiloRistoratore)}`,
      profiloRistoratore,
      { observe: 'response' },
    );
  }

  partialUpdate(profiloRistoratore: PartialUpdateProfiloRistoratore): Observable<EntityResponseType> {
    return this.http.patch<IProfiloRistoratore>(
      `${this.resourceUrl}/${this.getProfiloRistoratoreIdentifier(profiloRistoratore)}`,
      profiloRistoratore,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProfiloRistoratore>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfiloRistoratore[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProfiloRistoratoreIdentifier(profiloRistoratore: Pick<IProfiloRistoratore, 'id'>): number {
    return profiloRistoratore.id;
  }

  compareProfiloRistoratore(o1: Pick<IProfiloRistoratore, 'id'> | null, o2: Pick<IProfiloRistoratore, 'id'> | null): boolean {
    return o1 && o2 ? this.getProfiloRistoratoreIdentifier(o1) === this.getProfiloRistoratoreIdentifier(o2) : o1 === o2;
  }

  addProfiloRistoratoreToCollectionIfMissing<Type extends Pick<IProfiloRistoratore, 'id'>>(
    profiloRistoratoreCollection: Type[],
    ...profiloRistoratoresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const profiloRistoratores: Type[] = profiloRistoratoresToCheck.filter(isPresent);
    if (profiloRistoratores.length > 0) {
      const profiloRistoratoreCollectionIdentifiers = profiloRistoratoreCollection.map(profiloRistoratoreItem =>
        this.getProfiloRistoratoreIdentifier(profiloRistoratoreItem),
      );
      const profiloRistoratoresToAdd = profiloRistoratores.filter(profiloRistoratoreItem => {
        const profiloRistoratoreIdentifier = this.getProfiloRistoratoreIdentifier(profiloRistoratoreItem);
        if (profiloRistoratoreCollectionIdentifiers.includes(profiloRistoratoreIdentifier)) {
          return false;
        }
        profiloRistoratoreCollectionIdentifiers.push(profiloRistoratoreIdentifier);
        return true;
      });
      return [...profiloRistoratoresToAdd, ...profiloRistoratoreCollection];
    }
    return profiloRistoratoreCollection;
  }
}
