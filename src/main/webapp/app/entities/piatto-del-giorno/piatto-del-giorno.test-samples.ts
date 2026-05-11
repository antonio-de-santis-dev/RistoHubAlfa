import { IPiattoDelGiorno, NewPiattoDelGiorno } from './piatto-del-giorno.model';

export const sampleWithRequiredData: IPiattoDelGiorno = {
  id: 23156,
  attivo: false,
};

export const sampleWithPartialData: IPiattoDelGiorno = {
  id: 23824,
  attivo: true,
  nome: 'amid duh wilderness',
  descrizione: 'bind nor shiny',
};

export const sampleWithFullData: IPiattoDelGiorno = {
  id: 15015,
  attivo: false,
  nome: 'woot incidentally failing',
  descrizione: 'um',
  prezzo: 13181.67,
};

export const sampleWithNewData: NewPiattoDelGiorno = {
  attivo: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
