import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITraduzioneMenu, NewTraduzioneMenu } from '../traduzione-menu.model';

export type PartialUpdateTraduzioneMenu = Partial<ITraduzioneMenu> & Pick<ITraduzioneMenu, 'id'>;

export type EntityResponseType = HttpResponse<ITraduzioneMenu>;
export type EntityArrayResponseType = HttpResponse<ITraduzioneMenu[]>;

@Injectable({ providedIn: 'root' })
export class TraduzioneMenuService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/traduzione-menus');

  create(traduzioneMenu: NewTraduzioneMenu): Observable<EntityResponseType> {
    return this.http.post<ITraduzioneMenu>(this.resourceUrl, traduzioneMenu, { observe: 'response' });
  }

  update(traduzioneMenu: ITraduzioneMenu): Observable<EntityResponseType> {
    return this.http.put<ITraduzioneMenu>(`${this.resourceUrl}/${this.getTraduzioneMenuIdentifier(traduzioneMenu)}`, traduzioneMenu, {
      observe: 'response',
    });
  }

  partialUpdate(traduzioneMenu: PartialUpdateTraduzioneMenu): Observable<EntityResponseType> {
    return this.http.patch<ITraduzioneMenu>(`${this.resourceUrl}/${this.getTraduzioneMenuIdentifier(traduzioneMenu)}`, traduzioneMenu, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITraduzioneMenu>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITraduzioneMenu[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTraduzioneMenuIdentifier(traduzioneMenu: Pick<ITraduzioneMenu, 'id'>): number {
    return traduzioneMenu.id;
  }

  compareTraduzioneMenu(o1: Pick<ITraduzioneMenu, 'id'> | null, o2: Pick<ITraduzioneMenu, 'id'> | null): boolean {
    return o1 && o2 ? this.getTraduzioneMenuIdentifier(o1) === this.getTraduzioneMenuIdentifier(o2) : o1 === o2;
  }

  addTraduzioneMenuToCollectionIfMissing<Type extends Pick<ITraduzioneMenu, 'id'>>(
    traduzioneMenuCollection: Type[],
    ...traduzioneMenusToCheck: (Type | null | undefined)[]
  ): Type[] {
    const traduzioneMenus: Type[] = traduzioneMenusToCheck.filter(isPresent);
    if (traduzioneMenus.length > 0) {
      const traduzioneMenuCollectionIdentifiers = traduzioneMenuCollection.map(traduzioneMenuItem =>
        this.getTraduzioneMenuIdentifier(traduzioneMenuItem),
      );
      const traduzioneMenusToAdd = traduzioneMenus.filter(traduzioneMenuItem => {
        const traduzioneMenuIdentifier = this.getTraduzioneMenuIdentifier(traduzioneMenuItem);
        if (traduzioneMenuCollectionIdentifiers.includes(traduzioneMenuIdentifier)) {
          return false;
        }
        traduzioneMenuCollectionIdentifiers.push(traduzioneMenuIdentifier);
        return true;
      });
      return [...traduzioneMenusToAdd, ...traduzioneMenuCollection];
    }
    return traduzioneMenuCollection;
  }
}
