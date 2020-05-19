import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { appReducer } from './app.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('app', appReducer),
    // will import effects
  ],
  providers: [
    // will import providers
  ],
})
export class AppStoreModule {}
