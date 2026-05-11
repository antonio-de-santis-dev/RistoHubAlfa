import { IProdotto } from 'app/entities/prodotto/prodotto.model';
import { TipoAllergene } from 'app/entities/enumerations/tipo-allergene.model';
import { NomeAllergeneDefault } from 'app/entities/enumerations/nome-allergene-default.model';

export interface IAllergene {
  id: number;
  nome?: string | null;
  tipo?: keyof typeof TipoAllergene | null;
  nomeDefault?: keyof typeof NomeAllergeneDefault | null;
  prodottis?: Pick<IProdotto, 'id'>[] | null;
}

export type NewAllergene = Omit<IAllergene, 'id'> & { id: null };
