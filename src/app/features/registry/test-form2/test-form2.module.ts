import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestForm2Component } from './test-form2.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeatureModule } from '../../feature.module';
import { ScrollSpyModule } from 'src/app/shared/modules/scroll-spy/scroll-spy.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { RegistryFormModule } from 'src/app/shared/modules/registry-form/registry-form.module';

const routes: Routes = [
  {
    path: '',
    component: TestForm2Component,
  },
];

@NgModule({
  declarations: [TestForm2Component],
  imports: [
    SharedModule,
    FeatureModule,
    RouterModule.forChild(routes),
    ScrollSpyModule,
    RoundProgressModule,
    RegistryFormModule,
  ],
})
export class TestForm2Module {}
