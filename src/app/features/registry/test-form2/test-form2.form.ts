import { Validators } from '@angular/forms';

export const TestForm2Form = {
  sectionA: {
    registryId: [null, Validators.required],
    HN: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    AN: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(12)]],
    LastName: [null, Validators.required],
    FirstName: [null, Validators.required],
    Sex: [null, Validators.required],
    DOB: [null, Validators.required],
    Visit: [null, Validators.required],
    Animal: [null, Validators.required],
    Gender: [null, Validators.required],
  },
  sectionB: {
    HospName: [null, Validators.required],
    AdmType: [null, Validators.required],
    TransferHospType: [null, Validators.required],
    BDMSNetwork: [null, Validators.required],
    NonBDMS: [null, Validators.required],
  },
  sectionC: {
    Hypertension: [null, Validators.required],
    Dyslipidemia: [null, Validators.required],
    HxMI: [null, Validators.required],
  },
};
