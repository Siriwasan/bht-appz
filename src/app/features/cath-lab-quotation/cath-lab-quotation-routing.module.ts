import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CathLabQuotationComponent } from './cath-lab-quotation.component';

const routes: Routes = [
  {
    path: '',
    component: CathLabQuotationComponent,
  },
  {
    path: 'quotation',
    loadChildren: () => import('./quotation/quotation.module').then((m) => m.QuotationModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then((m) => m.ProductsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CathLabQuotationRoutingModule {}
