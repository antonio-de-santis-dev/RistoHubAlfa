export interface IListaContatti {
  id: number;
  note?: string | null;
}

export type NewListaContatti = Omit<IListaContatti, 'id'> & { id: null };
