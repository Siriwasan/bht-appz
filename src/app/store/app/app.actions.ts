import { createAction, props } from '@ngrx/store';

export const startLoading = createAction('[Application] START_LOADING');
export const stopLoading = createAction('[Application] STOP_LOADING');

export const setDarkTheme = createAction('[Application] SET_DARK_THEME', props<{ darkTheme: boolean }>());
export const toggleTheme = createAction('[Application] SET_THEME');
export const setDevice = createAction('[Application] SET_DEVICE', props<{ newDevice: string }>());
export const initializeLayout = createAction('[Application] INITIALIZE_LAYOUT');

export const setNavbarMode = createAction('[Application] SET_NAVBAR_MODE', props<{ mode: string }>());
export const openNavbar = createAction('[Application] OPEN_NAVBAR', (open = true) => ({ open }));
export const toggleNavbar = createAction('[Application] TOGGLE_NAVBAR');
export const closeNavbar = createAction('[Application] CLOSE_NAVBAR');
