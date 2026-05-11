import { IListaContatti } from 'app/entities/lista-contatti/lista-contatti.model';
import { TipoContatto } from 'app/entities/enumerations/tipo-contatto.model';

export interface IContattoItem {
  id: number;
  tipo?: keyof typeof TipoContatto | null;
  valore?: string | null;
  etichetta?: string | null;
  ordine?: number | null;
  lista?: Pick<IListaContatti, 'id'> | null;
}

export type NewContattoItem = Omit<IContattoItem, 'id'> & { id: null };
