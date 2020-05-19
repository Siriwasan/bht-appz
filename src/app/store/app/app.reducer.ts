import { createReducer, on } from '@ngrx/store';

import {
  startLoading,
  stopLoading,
  toggleTheme,
  setDarkTheme,
  setDevice,
  initializeLayout,
  setNavbarMode,
  openNavbar,
  toggleNavbar,
  closeNavbar,
  setSidebarMode,
  openSidebar,
  toggleSidebar,
  closeSidebar,
} from './app.actions';
import { initialState } from './app.state';

export const appReducer = createReducer(
  initialState,
  on(startLoading, (state) => {
    return { ...state, isLoading: true };
  }),
  on(stopLoading, (state) => {
    return { ...state, isLoading: false };
  }),
  on(setDarkTheme, (state, { darkTheme }) => {
    return { ...state, theme: darkTheme ? 'dark' : 'light' };
  }),
  on(toggleTheme, (state) => {
    return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
  }),
  on(setDevice, (state, { newDevice }) => {
    return { ...state, device: newDevice };
  }),
  on(initializeLayout, (state) => {
    let nbMode = 'side';
    let nbOpened = true;
    let sbMode = 'side';
    let sbOpened = true;

    switch (state.device) {
      case 'HandsetPortrait':
        nbMode = 'over';
        nbOpened = false;
        sbMode = 'over';
        sbOpened = false;
        break;
      case 'HandsetLandscape':
      case 'TabletPortrait':
        nbMode = 'over';
        nbOpened = false;
        sbMode = 'side';
        sbOpened = true;
        break;
      case 'Others':
        break;
      default:
        console.log('[Error] wrong device initialitation');
        break;
    }

    return {
      ...state,
      navbarMode: nbMode,
      navbarOpened: nbOpened,
      sidebarMode: sbMode,
      sidebarOpened: sbOpened,
    };
  }),

  // Navbar
  on(setNavbarMode, (state, { mode }) => {
    return { ...state, navbarMode: mode };
  }),
  on(openNavbar, (state, { open }) => {
    return { ...state, navbarOpened: open };
  }),
  on(toggleNavbar, (state) => {
    return {
      ...state,
      navbarOpened: !state.navbarOpened,
      sidebarOpened: state.sidebarMode === 'over' ? false : state.sidebarOpened,
    };
  }),
  on(closeNavbar, (state) => {
    return {
      ...state,
      navbarOpened: state.navbarMode === 'over' ? false : state.navbarOpened,
    };
  }),

  // Sidebar
  on(setSidebarMode, (state, { mode }) => {
    return { ...state, sidebarMode: mode };
  }),
  on(openSidebar, (state, { open }) => {
    return { ...state, sidebarOpened: open };
  }),
  on(toggleSidebar, (state) => {
    return {
      ...state,
      sidebarOpened: !state.sidebarOpened,
      navbarOpened: state.navbarMode === 'over' ? false : state.navbarOpened,
    };
  }),
  on(closeSidebar, (state) => {
    return {
      ...state,
      sidebarOpened: state.sidebarMode === 'over' ? false : state.sidebarOpened,
    };
  })
);
