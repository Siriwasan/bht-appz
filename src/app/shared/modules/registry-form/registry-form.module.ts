import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { RegistryFormService } from './registry-form.service';

import { RegistryInputComponent } from './controls/registry-input.component';
import { RegistryDatePickerComponent } from './controls/registry-date-picker.component';
import { RegistrySelectComponent } from './controls/registry-select.component';
import { RegistrySelectSearchComponent } from './controls/registry-select-search.component';
import { RegistrySelectMultipleComponent } from './controls/registry-select-multiple.component';
// import { RegistryAutocompleteComponent } from './registry-autocomplete.component';

@NgModule({
  declarations: [
    RegistryInputComponent,
    RegistryDatePickerComponent,
    RegistrySelectComponent,
    RegistrySelectSearchComponent,
    RegistrySelectMultipleComponent,
    // RegistryAutocompleteComponent,
  ],
  imports: [SharedModule],
  exports: [
    RegistryInputComponent,
    RegistryDatePickerComponent,
    RegistrySelectComponent,
    RegistrySelectSearchComponent,
    RegistrySelectMultipleComponent,
    // RegistryAutocompleteComponent,
  ],
  providers: [RegistryFormService],
})
export class RegistryFormModule {}
