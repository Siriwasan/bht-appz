import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AppStoreModule } from '../../store/app';
import { CounterStoreModule } from '../../store/counter';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes), AppStoreModule, CounterStoreModule],
})
export class HomeModule {}
