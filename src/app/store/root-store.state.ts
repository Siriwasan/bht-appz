import { AppStoreState } from './app';
import { ClqStoreState } from './cath-lab-quotation';

export interface AppState {
  app: AppStoreState.State;
  clq: ClqStoreState.State;
}
