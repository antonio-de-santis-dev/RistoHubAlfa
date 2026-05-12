// PERCORSO: src/main/webapp/app/entities/prodotto/prodotto.model.ts
//
// FIX APPLICATO:
//  - allergenis ora usa IAllergene completo (non solo Pick<IAllergene,'id'>)
//    così nel template si possono leggere a.tipo, a.nomeDefault, a.nome
//  - Aggiunto campo 'visibile' che era nel vecchio modello

import { IAllergene } from 'app/entities/allergene/allergene.model';
import { IPortata } from 'app/entities/portata/portata.model';

export interface IProdotto {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  visibile?: boolean | null;
  allergenis?: IAllergene[] | null; // ← IAllergene completo, non solo Pick
  portata?: Pick<IPortata, 'id'> | null;
}

export type NewProdotto = Omit<IProdotto, 'id'> & { id: null };
