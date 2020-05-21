import { FormGroup, AbstractControl } from '@angular/forms';
import { Input, OnInit, ElementRef } from '@angular/core';

import { ValidationMessage } from '../registry-form.model';
import { IRegistryControlService } from 'src/app/shared/modules/registry-form/registry-control-service.interface';

export class RegistryControlComponent implements OnInit {
  @Input() controlName: string;
  @Input() formGroup: FormGroup;
  @Input() placeholder: string;
  @Input() require = true;
  @Input() readonly = false;
  @Input() floatLabel = 'auto';
  @Input() controlService: IRegistryControlService = null;

  bInfo: boolean;
  self: AbstractControl;

  constructor(protected elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.setAttribute('id', this.controlName);
    this.bInfo = this.hasInfo(this.controlName);
    this.self = this.formGroup.get(this.controlName);
  }

  // for inject service interface
  public hasInfo = (control: string) => this.controlService?.hasInfo(control);
  public openInfo = (control: string) => this.controlService?.openInfo(control);
  public getInvalidMessages = (formGroup: FormGroup, control: string): ValidationMessage[] =>
    this.controlService?.getInvalidMessages(formGroup, control);
}
