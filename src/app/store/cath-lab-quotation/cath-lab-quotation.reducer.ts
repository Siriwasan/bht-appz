import { createReducer, on } from '@ngrx/store';

import { fetchProducts, fetchQuotations } from './cath-lab-quotation.actions';
import { initialState } from './cath-lab-quotation.state';

export const clqReducer = createReducer(
  initialState,
  on(fetchProducts, (state, { prods }) => {
    return { ...state, products: prods };
  }),
  on(fetchQuotations, (state, { quots }) => {
    return { ...state, quotations: quots };
  })
);
