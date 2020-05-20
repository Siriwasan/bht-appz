import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, NavbarComponent, AppLayoutComponent],
  imports: [CommonModule, BrowserModule, BrowserAnimationsModule, SharedModule],
  exports: [BrowserModule, BrowserAnimationsModule, HeaderComponent, NavbarComponent],
})
export class CoreModule {}
