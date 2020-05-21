import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationComponent } from './quotation.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistryFormModule } from 'src/app/shared/modules/registry-form/registry-form.module';

const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
  },
  {
    path: ':id',
    component: QuotationComponent,
  },
];

@NgModule({
  declarations: [QuotationComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes), RegistryFormModule],
})
export class QuotationModule {}
