import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './app.state';

const selectAppState = createFeatureSelector<State>('app');

export const isLoading = createSelector(selectAppState, (state) => state.isLoading);
export const theme = createSelector(selectAppState, (state) => state.theme);
export const device = createSelector(selectAppState, (state) => state.device);

export const navbarMode = createSelector(selectAppState, (state) => state.navbarMode);
export const navbarOpened = createSelector(selectAppState, (state) => state.navbarOpened);

export const sidebarMode = createSelector(selectAppState, (state) => state.sidebarMode);
export const sidebarOpened = createSelector(selectAppState, (state) => state.sidebarOpened);
