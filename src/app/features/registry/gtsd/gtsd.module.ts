import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GtsdRoutingModule } from './gtsd-routing.module';
import { GtsdComponent } from './gtsd.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GtsdComponent],
  imports: [CommonModule, SharedModule, GtsdRoutingModule, MaterialModule],
})
export class GtsdModule {}
