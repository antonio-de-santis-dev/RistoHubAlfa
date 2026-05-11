import { IProdotto, NewProdotto } from './prodotto.model';

export const sampleWithRequiredData: IProdotto = {
  id: 31021,
  nome: 'guilty beyond',
  prezzo: 22297,
  visibile: false,
};

export const sampleWithPartialData: IProdotto = {
  id: 25034,
  nome: 'married',
  descrizione: 'bloom platypus portly',
  prezzo: 14132.48,
  visibile: true,
};

export const sampleWithFullData: IProdotto = {
  id: 29949,
  nome: 'sticker',
  descrizione: 'psst',
  prezzo: 7867.59,
  visibile: false,
};

export const sampleWithNewData: NewProdotto = {
  nome: 'pish offset near',
  prezzo: 10680.87,
  visibile: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
