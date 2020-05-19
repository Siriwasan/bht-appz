import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GtsdComponent } from './gtsd/gtsd.component';

const routes: Routes = [
  {
    path: 'test-form',
    loadChildren: () => import('./test-form/test-form.module').then((m) => m.TestFormModule),
  },
  {
    path: 'test-form2',
    loadChildren: () => import('./test-form2/test-form2.module').then((m) => m.TestForm2Module),
  },
  {
    path: 'test-form3',
    loadChildren: () => import('./test-form3/test-form3.module').then((m) => m.TestForm3Module),
  },
  {
    path: 'gtsd',
    loadChildren: () => import('./gtsd/gtsd.module').then((m) => m.GtsdModule),
  },
  {
    path: 'acsd',
    loadChildren: () => import('./acsd/acsd.module').then((m) => m.AcsdModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistryRoutingModule {}
