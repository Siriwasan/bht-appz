import { createSelector, createFeatureSelector } from '@ngrx/store';

const selectCounterState = createFeatureSelector('count');

export const count = createSelector(selectCounterState, (state) => state);
