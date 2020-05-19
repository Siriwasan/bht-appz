import { NgModule } from '@angular/core';

// import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from '../../shared/shared.module';
import { FeatureModule } from '../feature.module';
import { RegistryRoutingModule } from './registry-routing.module';
import { RegistryFormModule } from 'src/app/shared/modules/registry-form/registry-form.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, FeatureModule, RegistryRoutingModule],
  providers: [],
})
export class RegistryModule {}
