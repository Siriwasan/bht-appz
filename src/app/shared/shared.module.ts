import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FabSpeedDialModule } from './modules/fab-speed-dial/fab-speed-dial.module';
import { NoSanitizePipe } from './pipes/no-sanitize.pipe';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { IsoDatePipe } from './pipes/iso-date.pipe';

@NgModule({
  declarations: [ModalDialogComponent, NoSanitizePipe, IsoDatePipe],
  imports: [CommonModule, MaterialModule, FabSpeedDialModule],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    FabSpeedDialModule,
    ModalDialogComponent,
    NoSanitizePipe,
    IsoDatePipe,
  ],
})
export class SharedModule {}
