import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './cath-lab-quotation.state';

const selectClqState = createFeatureSelector<State>('clq');

export const products = createSelector(selectClqState, (state) => state.products);

export const quotations = createSelector(selectClqState, (state) => state.quotations);
export const quotation = (id: string) => createSelector(selectClqState, (state) => state.quotations?.find((quot) => quot.id === id));
