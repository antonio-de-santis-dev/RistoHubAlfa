import { IMenu } from 'app/entities/menu/menu.model';
import { IProdotto } from 'app/entities/prodotto/prodotto.model';

export interface IPiattoDelGiorno {
  id: number;
  attivo?: boolean | null;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  menu?: Pick<IMenu, 'id'> | null;
  prodotto?: Pick<IProdotto, 'id'> | null;
}

export type NewPiattoDelGiorno = Omit<IPiattoDelGiorno, 'id'> & { id: null };
