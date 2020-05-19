import { ValidationMessage } from './registry-form.model';
import { FormGroup } from '@angular/forms';

export interface IRegistryControlService {
  hasInfo(control: string): boolean;
  openInfo(control: string): void;
  getInvalidMessages(formGroup: FormGroup, control: string): ValidationMessage[];
}
