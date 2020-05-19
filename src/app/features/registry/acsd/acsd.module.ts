import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcsdRoutingModule } from './acsd-routing.module';
import { AcsdComponent } from './acsd.component';


@NgModule({
  declarations: [AcsdComponent],
  imports: [
    CommonModule,
    AcsdRoutingModule
  ]
})
export class AcsdModule { }
