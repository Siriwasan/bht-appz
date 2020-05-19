import { FormConditions } from 'src/app/shared/modules/registry-form/registry-form.model';

export const TestForm3Conditions: FormConditions = {
  sectionA: [
    { control: 'DOB', parentControl: 'Sex', conditions: ['Male'] },
    // { control: 'Animal', parentControl: 'Sex', conditions: ['dog'] },
    // { control: 'Visit', parentControl: 'Animal', conditions: ['hen'] },
  ],
  sectionB: [],
  sectionC: [],
};
