import { createAction, props } from '@ngrx/store';
import { Product, Quotation } from 'src/app/features/cath-lab-quotation/cath-lab-quotation.model';

export const fetchProducts = createAction('[CLQ] FETCH_PRODUCTS', props<{ prods: Product[] }>());
export const fetchQuotations = createAction('[CLQ] FETCH_QUOTATIONS', props<{ quots: Quotation[] }>());
