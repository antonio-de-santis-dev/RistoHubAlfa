import { IAllergene, NewAllergene } from './allergene.model';

export const sampleWithRequiredData: IAllergene = {
  id: 22036,
  nome: 'tribe tightly psst',
  tipo: 'DEFAULT',
};

export const sampleWithPartialData: IAllergene = {
  id: 1465,
  nome: 'near same runny',
  tipo: 'DEFAULT',
  nomeDefault: 'SOIA',
};

export const sampleWithFullData: IAllergene = {
  id: 22214,
  nome: 'boohoo whose like',
  tipo: 'DEFAULT',
  nomeDefault: 'LATTE',
};

export const sampleWithNewData: NewAllergene = {
  nome: 'meanwhile seal',
  tipo: 'PERSONALIZZATO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
