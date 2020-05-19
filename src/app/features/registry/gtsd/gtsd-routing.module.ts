import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GtsdComponent } from './gtsd.component';

const routes: Routes = [
  {
    path: '',
    component: GtsdComponent,
  },
  {
    path: 'gtsd241',
    loadChildren: () => import('./gtsd241/gtsd241.module').then((m) => m.Gtsd241Module),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GtsdRoutingModule {}
