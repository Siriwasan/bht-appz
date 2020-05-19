import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IRegistryControlService } from 'src/app/shared/modules/registry-form/registry-control-service.interface';
import { ValidationMessage } from 'src/app/shared/modules/registry-form/registry-form.model';

const mockInfo = [
  { control: 'HN', info: 'This is HN' },
  { control: 'AN', info: 'This is AN, Awesome!!' },
];

const mockValidations: { [control: string]: ValidationMessage[] } = {
  HN: [
    { type: 'required', message: 'Test HN is required.' },
    { type: 'minlength', message: 'Test HN must be at least 10.' },
    { type: 'maxlength', message: 'Test HN cannot be more than 10.' },
  ],
  AN: [
    { type: 'required', message: 'Test AN is required.' },
    { type: 'minlength', message: 'Test AN must be at least 11.' },
    { type: 'maxlength', message: 'Test AN cannot be more than 12.' },
  ],
};

@Injectable()
export class TestForm2Service implements IRegistryControlService {
  hasInfo(control: string): boolean {
    return mockInfo.findIndex((info) => info.control === control) > -1;
  }

  openInfo(control: string): void {
    const infoMessage = mockInfo.find((info) => info.control === control);
    console.log(infoMessage.info);
  }

  getInvalidMessages(formGroup: FormGroup, control: string): ValidationMessage[] {
    const invalidVals: ValidationMessage[] = [];

    const result = Object.entries(mockValidations).find(([key, value]) => key === control);
    if (!result) {
      return null;
    }

    result[1].forEach((val) => {
      if (formGroup.get(control).hasError(val.type)) {
        invalidVals.push(val);
      }
    });

    return invalidVals;
  }
}
