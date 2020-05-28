import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { clqReducer } from './cath-lab-quotation.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('clq', clqReducer),
    // will import effects
  ],
  providers: [
    // will import providers
  ],
})
export class ClqStoreModule {}
