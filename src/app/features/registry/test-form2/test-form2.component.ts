import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  AfterContentInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';

import { ScrollSpyService } from '../../../shared/modules/scroll-spy/scroll-spy.service';
import { RegistryFormComponent } from 'src/app/shared/modules/registry-form/registry-form.component';
import { AppState } from 'src/app/store/root-store.state';

import {
  FormVisibility,
  SectionMember,
  RegSelectChoice,
} from 'src/app/shared/modules/registry-form/registry-form.model';
import { RegistryFormService } from 'src/app/shared/modules/registry-form/registry-form.service';
import { TestForm2Conditions } from './test-form2.condition';
import { TestForm2Validations } from './test-form2.validation';
import { TestForm2Form } from './test-form2.form';
import { TestForm2Service } from './test-form2.service';

@Component({
  selector: 'app-test-form2',
  templateUrl: './test-form2.component.html',
  styleUrls: ['./test-form2.component.scss'],
  providers: [TestForm2Service],
})
export class TestForm2Component extends RegistryFormComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  visibility: FormVisibility = {};
  controlService = this.testForm2Service;

  animals: RegSelectChoice[] = [];

  //#region FormGroup and FormDirective
  formGroupA: FormGroup;
  formGroupB: FormGroup;
  formGroupC: FormGroup;

  @ViewChild('formDirectiveA', { static: true })
  formDirectiveA: FormGroupDirective;
  @ViewChild('formDirectiveB', { static: true })
  formDirectiveB: FormGroupDirective;
  @ViewChild('formDirectiveC', { static: true })
  formDirectiveC: FormGroupDirective;

  private sectionMembers: SectionMember[];
  //#endregion

  constructor(
    protected store: Store<AppState>,
    protected scrollSpy: ScrollSpyService,
    protected changeDetector: ChangeDetectorRef,
    protected hostElement: ElementRef,
    private registryFormService: RegistryFormService,
    private formBuilder: FormBuilder,
    private testForm2Service: TestForm2Service
  ) {
    super(store, scrollSpy, changeDetector, hostElement);
  }

  ngOnInit() {
    super.ngOnInit();

    this.animals = [
      { value: 'duck', label: 'Duck', altLabel: 'เป็ด', group: 'Wings', disable: false },
      { value: 'dog', label: 'Dog', altLabel: 'หมา', group: 'Four legs', disable: false },
      { value: 'hen', label: 'Hen', altLabel: 'แม่ไก่', group: 'Wings', disable: false },
      { value: 'goose', label: 'Goose', altLabel: 'ห่าน', group: 'Wings', disable: false },
      { value: 'cat', label: 'Cat', altLabel: 'แมว', group: 'Four legs', disable: false },
    ];
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.createForm();
    this.registryFormService.subscribeFormConditions();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  private createForm() {
    this.formGroupA = this.formBuilder.group(TestForm2Form.sectionA);
    this.formGroupB = this.formBuilder.group(TestForm2Form.sectionB);
    this.formGroupC = this.formBuilder.group(TestForm2Form.sectionC);

    this.sectionMembers = [
      ['sectionA', this.formGroupA, this.formDirectiveA, TestForm2Conditions.sectionA],
      ['sectionB', this.formGroupB, this.formDirectiveB, TestForm2Conditions.sectionB],
      ['sectionC', this.formGroupC, this.formDirectiveC, TestForm2Conditions.sectionC],
    ];

    this.registryFormService.initializeForm(
      this.sectionMembers,
      TestForm2Conditions,
      TestForm2Validations,
      this.visibility
    );
    this.registryFormService.setDataDict(require('raw-loader!./test-form2.dict.md').default);
  }
}
