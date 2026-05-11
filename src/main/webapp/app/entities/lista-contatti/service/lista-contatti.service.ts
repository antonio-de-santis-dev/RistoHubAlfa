import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IListaContatti, NewListaContatti } from '../lista-contatti.model';

export type PartialUpdateListaContatti = Partial<IListaContatti> & Pick<IListaContatti, 'id'>;

export type EntityResponseType = HttpResponse<IListaContatti>;
export type EntityArrayResponseType = HttpResponse<IListaContatti[]>;

@Injectable({ providedIn: 'root' })
export class ListaContattiService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lista-contattis');

  create(listaContatti: NewListaContatti): Observable<EntityResponseType> {
    return this.http.post<IListaContatti>(this.resourceUrl, listaContatti, { observe: 'response' });
  }

  update(listaContatti: IListaContatti): Observable<EntityResponseType> {
    return this.http.put<IListaContatti>(`${this.resourceUrl}/${this.getListaContattiIdentifier(listaContatti)}`, listaContatti, {
      observe: 'response',
    });
  }

  partialUpdate(listaContatti: PartialUpdateListaContatti): Observable<EntityResponseType> {
    return this.http.patch<IListaContatti>(`${this.resourceUrl}/${this.getListaContattiIdentifier(listaContatti)}`, listaContatti, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IListaContatti>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IListaContatti[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getListaContattiIdentifier(listaContatti: Pick<IListaContatti, 'id'>): number {
    return listaContatti.id;
  }

  compareListaContatti(o1: Pick<IListaContatti, 'id'> | null, o2: Pick<IListaContatti, 'id'> | null): boolean {
    return o1 && o2 ? this.getListaContattiIdentifier(o1) === this.getListaContattiIdentifier(o2) : o1 === o2;
  }

  addListaContattiToCollectionIfMissing<Type extends Pick<IListaContatti, 'id'>>(
    listaContattiCollection: Type[],
    ...listaContattisToCheck: (Type | null | undefined)[]
  ): Type[] {
    const listaContattis: Type[] = listaContattisToCheck.filter(isPresent);
    if (listaContattis.length > 0) {
      const listaContattiCollectionIdentifiers = listaContattiCollection.map(listaContattiItem =>
        this.getListaContattiIdentifier(listaContattiItem),
      );
      const listaContattisToAdd = listaContattis.filter(listaContattiItem => {
        const listaContattiIdentifier = this.getListaContattiIdentifier(listaContattiItem);
        if (listaContattiCollectionIdentifiers.includes(listaContattiIdentifier)) {
          return false;
        }
        listaContattiCollectionIdentifiers.push(listaContattiIdentifier);
        return true;
      });
      return [...listaContattisToAdd, ...listaContattiCollection];
    }
    return listaContattiCollection;
  }
}
