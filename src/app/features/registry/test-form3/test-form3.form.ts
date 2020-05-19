import { Validators } from '@angular/forms';

export const TestForm3Form = {
  sectionA: {
    HN: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    AN: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(12)]],
    LastName: [null, Validators.required],
    FirstName: [null, Validators.required],
    Sex: [null, Validators.required],
    DOB: [null, Validators.required],
  },
  sectionB: {
    Payor: [null, Validators.required],
    Province: [null, Validators.required],
  },
};
