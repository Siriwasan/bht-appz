import { Product, Quotation } from 'src/app/features/cath-lab-quotation/cath-lab-quotation.model';

export interface State {
  products: Product[];
  quotations: Quotation[];
}

export const initialState: State = {
  products: null,
  quotations: null,
};
