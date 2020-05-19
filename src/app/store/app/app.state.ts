export interface State {
  isLoading: boolean;
  theme: string;
  device: string;
  navbarMode: string;
  navbarOpened: boolean;
  sidebarMode: string;
  sidebarOpened: boolean;
}

export const initialState: State = {
  isLoading: false,
  theme: 'light',
  device: 'others',
  navbarMode: 'side',
  navbarOpened: true,
  sidebarMode: 'side',
  sidebarOpened: true,
};
