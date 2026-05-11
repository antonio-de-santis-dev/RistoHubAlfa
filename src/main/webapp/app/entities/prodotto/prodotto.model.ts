import { IAllergene } from 'app/entities/allergene/allergene.model';
import { IPortata } from 'app/entities/portata/portata.model';

export interface IProdotto {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  visibile?: boolean | null;
  allergenis?: Pick<IAllergene, 'id'>[] | null;
  portata?: Pick<IPortata, 'id'> | null;
}

export type NewProdotto = Omit<IProdotto, 'id'> & { id: null };
