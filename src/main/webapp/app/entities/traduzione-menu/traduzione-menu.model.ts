import { IMenu } from 'app/entities/menu/menu.model';

export interface ITraduzioneMenu {
  id: number;
  lingua?: string | null;
  contenutoJson?: string | null;
  modificata?: boolean | null;
  menu?: Pick<IMenu, 'id'> | null;
}

export type NewTraduzioneMenu = Omit<ITraduzioneMenu, 'id'> & { id: null };
