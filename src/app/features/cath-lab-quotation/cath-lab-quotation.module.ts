import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CathLabQuotationRoutingModule } from './cath-lab-quotation-routing.module';
import { CathLabQuotationComponent } from './cath-lab-quotation.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CathLabQuotationComponent],
  imports: [CommonModule, SharedModule, CathLabQuotationRoutingModule, MaterialModule],
})
export class CathLabQuotationModule {}
