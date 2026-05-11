import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContattoItem, NewContattoItem } from '../contatto-item.model';

export type PartialUpdateContattoItem = Partial<IContattoItem> & Pick<IContattoItem, 'id'>;

export type EntityResponseType = HttpResponse<IContattoItem>;
export type EntityArrayResponseType = HttpResponse<IContattoItem[]>;

@Injectable({ providedIn: 'root' })
export class ContattoItemService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contatto-items');

  create(contattoItem: NewContattoItem): Observable<EntityResponseType> {
    return this.http.post<IContattoItem>(this.resourceUrl, contattoItem, { observe: 'response' });
  }

  update(contattoItem: IContattoItem): Observable<EntityResponseType> {
    return this.http.put<IContattoItem>(`${this.resourceUrl}/${this.getContattoItemIdentifier(contattoItem)}`, contattoItem, {
      observe: 'response',
    });
  }

  partialUpdate(contattoItem: PartialUpdateContattoItem): Observable<EntityResponseType> {
    return this.http.patch<IContattoItem>(`${this.resourceUrl}/${this.getContattoItemIdentifier(contattoItem)}`, contattoItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContattoItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContattoItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getContattoItemIdentifier(contattoItem: Pick<IContattoItem, 'id'>): number {
    return contattoItem.id;
  }

  compareContattoItem(o1: Pick<IContattoItem, 'id'> | null, o2: Pick<IContattoItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getContattoItemIdentifier(o1) === this.getContattoItemIdentifier(o2) : o1 === o2;
  }

  addContattoItemToCollectionIfMissing<Type extends Pick<IContattoItem, 'id'>>(
    contattoItemCollection: Type[],
    ...contattoItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const contattoItems: Type[] = contattoItemsToCheck.filter(isPresent);
    if (contattoItems.length > 0) {
      const contattoItemCollectionIdentifiers = contattoItemCollection.map(contattoItemItem =>
        this.getContattoItemIdentifier(contattoItemItem),
      );
      const contattoItemsToAdd = contattoItems.filter(contattoItemItem => {
        const contattoItemIdentifier = this.getContattoItemIdentifier(contattoItemItem);
        if (contattoItemCollectionIdentifiers.includes(contattoItemIdentifier)) {
          return false;
        }
        contattoItemCollectionIdentifiers.push(contattoItemIdentifier);
        return true;
      });
      return [...contattoItemsToAdd, ...contattoItemCollection];
    }
    return contattoItemCollection;
  }
}
