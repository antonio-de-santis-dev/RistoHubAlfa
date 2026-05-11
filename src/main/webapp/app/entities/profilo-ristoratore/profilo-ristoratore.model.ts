import { IUser } from 'app/entities/user/user.model';
import { LivelloUtente } from 'app/entities/enumerations/livello-utente.model';

export interface IProfiloRistoratore {
  id: number;
  livello?: keyof typeof LivelloUtente | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewProfiloRistoratore = Omit<IProfiloRistoratore, 'id'> & { id: null };
