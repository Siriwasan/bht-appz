import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { counterReducer } from './counter.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('count', counterReducer),
    // will import effects
  ],
  providers: [
    // will import providers
  ],
})
export class CounterStoreModule {}
