import { IProfiloRistoratore, NewProfiloRistoratore } from './profilo-ristoratore.model';

export const sampleWithRequiredData: IProfiloRistoratore = {
  id: 395,
  livello: 'LIVELLO_3',
};

export const sampleWithPartialData: IProfiloRistoratore = {
  id: 11126,
  livello: 'LIVELLO_1',
};

export const sampleWithFullData: IProfiloRistoratore = {
  id: 17243,
  livello: 'LIVELLO_1',
};

export const sampleWithNewData: NewProfiloRistoratore = {
  livello: 'LIVELLO_1',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
