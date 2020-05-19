import { NgModule } from '@angular/core';

import { LoremIpsumComponent } from './registry/lorem-ipsum.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { MatDatepickerModule, MatMomentDateModule } from '../shared/modules/mat-datepicker';

@NgModule({
  declarations: [LoremIpsumComponent, LoginComponent],
  imports: [SharedModule, MatDatepickerModule, MatMomentDateModule],
  exports: [LoremIpsumComponent],
})
export class FeatureModule {}
