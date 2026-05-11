import { IContattoItem, NewContattoItem } from './contatto-item.model';

export const sampleWithRequiredData: IContattoItem = {
  id: 5305,
  tipo: 'X',
  valore: 'soulful',
  ordine: 29601,
};

export const sampleWithPartialData: IContattoItem = {
  id: 30958,
  tipo: 'THREADS',
  valore: 'convince',
  etichetta: 'birdbath',
  ordine: 14739,
};

export const sampleWithFullData: IContattoItem = {
  id: 5920,
  tipo: 'MESSENGER',
  valore: 'so acceptable blah',
  etichetta: 'entire uh-huh',
  ordine: 26750,
};

export const sampleWithNewData: NewContattoItem = {
  tipo: 'X',
  valore: 'comb',
  ordine: 875,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
