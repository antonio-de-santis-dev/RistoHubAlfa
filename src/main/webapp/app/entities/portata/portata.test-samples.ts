import { IPortata, NewPortata } from './portata.model';

export const sampleWithRequiredData: IPortata = {
  id: 25438,
  tipo: 'PERSONALIZZATA',
  ordine: 2372,
};

export const sampleWithPartialData: IPortata = {
  id: 4431,
  tipo: 'DEFAULT',
  ordine: 14512,
};

export const sampleWithFullData: IPortata = {
  id: 24776,
  tipo: 'DEFAULT',
  nomeDefault: 'CONTORNO',
  nomePersonalizzato: 'joyful',
  ordine: 11050,
};

export const sampleWithNewData: NewPortata = {
  tipo: 'PERSONALIZZATA',
  ordine: 30888,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
