import { ITraduzioneMenu, NewTraduzioneMenu } from './traduzione-menu.model';

export const sampleWithRequiredData: ITraduzioneMenu = {
  id: 26768,
  lingua: 'becau',
  contenutoJson: '../fake-data/blob/hipster.txt',
  modificata: true,
};

export const sampleWithPartialData: ITraduzioneMenu = {
  id: 31944,
  lingua: 'circa',
  contenutoJson: '../fake-data/blob/hipster.txt',
  modificata: true,
};

export const sampleWithFullData: ITraduzioneMenu = {
  id: 10749,
  lingua: 'blah ',
  contenutoJson: '../fake-data/blob/hipster.txt',
  modificata: true,
};

export const sampleWithNewData: NewTraduzioneMenu = {
  lingua: 'lowba',
  contenutoJson: '../fake-data/blob/hipster.txt',
  modificata: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
