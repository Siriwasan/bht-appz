import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { MatDatepickerModule, MatMomentDateModule } from '../shared/modules/mat-datepicker';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, MatDatepickerModule, MatMomentDateModule],
  exports: [],
})
export class FeatureModule {}
