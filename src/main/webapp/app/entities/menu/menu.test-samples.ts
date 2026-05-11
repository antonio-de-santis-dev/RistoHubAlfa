import { IMenu, NewMenu } from './menu.model';

export const sampleWithRequiredData: IMenu = {
  id: 26476,
  nome: 'yak whine',
  attivo: true,
};

export const sampleWithPartialData: IMenu = {
  id: 29015,
  nome: 'handful',
  descrizione: 'whack',
  attivo: false,
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
};

export const sampleWithFullData: IMenu = {
  id: 277,
  nome: 'wilt honesty',
  descrizione: 'after',
  attivo: true,
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
  logoNome: 'nor perky',
};

export const sampleWithNewData: NewMenu = {
  nome: 'supposing finally',
  attivo: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
