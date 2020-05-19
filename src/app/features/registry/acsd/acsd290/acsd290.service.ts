import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IRegistryControlService } from 'src/app/shared/modules/registry-form/registry-control-service.interface';
import { ValidationMessage } from 'src/app/shared/modules/registry-form/registry-form.model';

@Injectable({
  providedIn: 'root',
})
export class Acsd290Service implements IRegistryControlService {
  constructor() {}

  hasInfo(control: string): boolean {
    console.log('hasInfo', control);
    return false;
  }
  openInfo(control: string): void {
    console.log('openInfo');
  }
  getInvalidMessages(formGroup: FormGroup, control: string): ValidationMessage[] {
    return [];
  }
}
