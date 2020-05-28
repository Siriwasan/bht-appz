export interface State {
  isLoading: boolean;
  theme: string;
  device: string;
  navbarMode: string;
  navbarOpened: boolean;
}

export const initialState: State = {
  isLoading: false,
  theme: 'light',
  device: 'others',
  navbarMode: 'side',
  navbarOpened: true,
};
