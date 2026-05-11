import { IListaContatti, NewListaContatti } from './lista-contatti.model';

export const sampleWithRequiredData: IListaContatti = {
  id: 4523,
};

export const sampleWithPartialData: IListaContatti = {
  id: 15354,
};

export const sampleWithFullData: IListaContatti = {
  id: 25397,
  note: 'that clinking since',
};

export const sampleWithNewData: NewListaContatti = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
