import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPiattoDelGiorno, NewPiattoDelGiorno } from '../piatto-del-giorno.model';

export type PartialUpdatePiattoDelGiorno = Partial<IPiattoDelGiorno> & Pick<IPiattoDelGiorno, 'id'>;

export type EntityResponseType = HttpResponse<IPiattoDelGiorno>;
export type EntityArrayResponseType = HttpResponse<IPiattoDelGiorno[]>;

@Injectable({ providedIn: 'root' })
export class PiattoDelGiornoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/piatto-del-giornos');

  create(piattoDelGiorno: NewPiattoDelGiorno): Observable<EntityResponseType> {
    return this.http.post<IPiattoDelGiorno>(this.resourceUrl, piattoDelGiorno, { observe: 'response' });
  }

  update(piattoDelGiorno: IPiattoDelGiorno): Observable<EntityResponseType> {
    return this.http.put<IPiattoDelGiorno>(`${this.resourceUrl}/${this.getPiattoDelGiornoIdentifier(piattoDelGiorno)}`, piattoDelGiorno, {
      observe: 'response',
    });
  }

  partialUpdate(piattoDelGiorno: PartialUpdatePiattoDelGiorno): Observable<EntityResponseType> {
    return this.http.patch<IPiattoDelGiorno>(`${this.resourceUrl}/${this.getPiattoDelGiornoIdentifier(piattoDelGiorno)}`, piattoDelGiorno, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPiattoDelGiorno>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPiattoDelGiorno[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPiattoDelGiornoIdentifier(piattoDelGiorno: Pick<IPiattoDelGiorno, 'id'>): number {
    return piattoDelGiorno.id;
  }

  comparePiattoDelGiorno(o1: Pick<IPiattoDelGiorno, 'id'> | null, o2: Pick<IPiattoDelGiorno, 'id'> | null): boolean {
    return o1 && o2 ? this.getPiattoDelGiornoIdentifier(o1) === this.getPiattoDelGiornoIdentifier(o2) : o1 === o2;
  }

  addPiattoDelGiornoToCollectionIfMissing<Type extends Pick<IPiattoDelGiorno, 'id'>>(
    piattoDelGiornoCollection: Type[],
    ...piattoDelGiornosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const piattoDelGiornos: Type[] = piattoDelGiornosToCheck.filter(isPresent);
    if (piattoDelGiornos.length > 0) {
      const piattoDelGiornoCollectionIdentifiers = piattoDelGiornoCollection.map(piattoDelGiornoItem =>
        this.getPiattoDelGiornoIdentifier(piattoDelGiornoItem),
      );
      const piattoDelGiornosToAdd = piattoDelGiornos.filter(piattoDelGiornoItem => {
        const piattoDelGiornoIdentifier = this.getPiattoDelGiornoIdentifier(piattoDelGiornoItem);
        if (piattoDelGiornoCollectionIdentifiers.includes(piattoDelGiornoIdentifier)) {
          return false;
        }
        piattoDelGiornoCollectionIdentifiers.push(piattoDelGiornoIdentifier);
        return true;
      });
      return [...piattoDelGiornosToAdd, ...piattoDelGiornoCollection];
    }
    return piattoDelGiornoCollection;
  }
}
