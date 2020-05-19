import { FormValidations } from 'src/app/shared/modules/registry-form/registry-form.model';

export const TestForm3Validations: FormValidations = {
  sectionA: {
    HN: [
      { type: 'required', message: 'HN is required.' },
      { type: 'minlength', message: 'HN must be at least 10.' },
      { type: 'maxlength', message: 'HN cannot be more than 10.' },
    ],
    AN: [
      { type: 'required', message: 'AN is required.' },
      { type: 'minlength', message: 'AN must be at least 11.' },
      { type: 'maxlength', message: 'AN cannot be more than 12.' },
    ],
  },
  sectionB: {},
  sectionC: {},
};
