import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationsComponent } from './quotations.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';

const routes: Routes = [
  {
    path: '',
    component: QuotationsComponent,
  },
];

@NgModule({
  declarations: [QuotationsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule],
})
export class QuotationsModule {}
