import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from 'src/app/shared/shared.module';
import { FeatureModule } from 'src/app/features/feature.module';
import { RegistryFormModule } from 'src/app/shared/modules/registry-form/registry-form.module';
import { Gtsd241Component } from './gtsd241.component';
import { ScrollSpyModule } from 'src/app/shared/modules/scroll-spy/scroll-spy.module';

const routes: Routes = [
  {
    path: '',
    component: Gtsd241Component,
  },
];

@NgModule({
  declarations: [Gtsd241Component],
  imports: [
    SharedModule,
    FeatureModule,
    RouterModule.forChild(routes),
    RegistryFormModule,
    ScrollSpyModule,
    RoundProgressModule,
  ],
})
export class Gtsd241Module {}
