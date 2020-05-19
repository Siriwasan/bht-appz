import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcsdComponent } from './acsd.component';

const routes: Routes = [
  {
    path: '',
    component: AcsdComponent,
  },
  {
    path: 'acsd290',
    loadChildren: () => import('./acsd290/acsd290.module').then((m) => m.Acsd290Module),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcsdRoutingModule {}
