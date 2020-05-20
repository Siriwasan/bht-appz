import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationComponent } from './quotation.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
  },
];

@NgModule({
  declarations: [QuotationComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class QuotationModule {}
