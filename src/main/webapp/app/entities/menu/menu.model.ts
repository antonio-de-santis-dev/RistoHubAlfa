import { IListaContatti } from 'app/entities/lista-contatti/lista-contatti.model';
import { IUser } from 'app/entities/user/user.model';

export interface IMenu {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  attivo?: boolean | null;
  logo?: string | null;
  logoContentType?: string | null;
  logoNome?: string | null;
  contatti?: Pick<IListaContatti, 'id'> | null;
  ristoratore?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewMenu = Omit<IMenu, 'id'> & { id: null };
