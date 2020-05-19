import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/root-store.state';
import { RegistryFormComponent } from 'src/app/shared/modules/registry-form/registry-form.component';
import { ScrollSpyService } from 'src/app/shared/modules/scroll-spy/scroll-spy.service';
import { RegistryFormService } from 'src/app/shared/modules/registry-form/registry-form.service';
import { Acsd290Service } from './acsd290.service';
import {
  FormVisibility,
  SectionMember,
  RegSelectChoice,
  FormCompletion,
} from 'src/app/shared/modules/registry-form/registry-form.model';
import { FormDetail } from '../../registry.model';

import * as registryData from '../../registry.data';
import {
  Acsd290Toc,
  getTocTitle,
  Acsd290Form,
  Acsd290Data,
  Acsd290Conditions,
  Acsd290Validations,
} from '.';
import { Acsd290Completion } from './acsd290.model';
import { Subscription } from 'rxjs';
import { AppStoreActions } from 'src/app/store/app';

@Component({
  selector: 'app-acsd290',
  templateUrl: './acsd290.component.html',
  styleUrls: ['./acsd290.component.scss'],
  providers: [Acsd290Service],
})
export class Acsd290Component extends RegistryFormComponent
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  visibility: FormVisibility = {};
  private subscriptions: Subscription[] = [];
  private completion: Acsd290Completion;

  controlService = this.acsd290Service;
  getTocTitle = getTocTitle;

  //#region FormGroup and FormDirective

  formDetail: FormDetail;
  formGroupA: FormGroup;
  formGroupB: FormGroup;
  formGroupC: FormGroup;
  formGroupD: FormGroup;
  formGroupE: FormGroup;
  formGroupF: FormGroup;
  formGroupG: FormGroup;
  formGroupH: FormGroup;
  formGroupI: FormGroup;
  formGroupJ: FormGroup;
  formGroupK: FormGroup;
  formGroupL: FormGroup;
  formGroupL2: FormGroup;
  formGroupM: FormGroup;
  formGroupM1: FormGroup;
  formGroupM2: FormGroup;
  formGroupM3: FormGroup;
  formGroupN: FormGroup;
  formGroupO: FormGroup;
  formGroupP: FormGroup;
  formGroupQ: FormGroup;
  formGroupR: FormGroup;
  formGroupS: FormGroup;

  @ViewChild('formDirectiveA', { static: true }) formDirectiveA: FormGroupDirective;
  @ViewChild('formDirectiveB', { static: true }) formDirectiveB: FormGroupDirective;
  @ViewChild('formDirectiveC', { static: true }) formDirectiveC: FormGroupDirective;
  @ViewChild('formDirectiveD', { static: true }) formDirectiveD: FormGroupDirective;
  @ViewChild('formDirectiveE', { static: true }) formDirectiveE: FormGroupDirective;
  @ViewChild('formDirectiveF', { static: true }) formDirectiveF: FormGroupDirective;
  @ViewChild('formDirectiveG', { static: true }) formDirectiveG: FormGroupDirective;
  @ViewChild('formDirectiveH', { static: true }) formDirectiveH: FormGroupDirective;
  @ViewChild('formDirectiveI', { static: true }) formDirectiveI: FormGroupDirective;
  @ViewChild('formDirectiveJ', { static: true }) formDirectiveJ: FormGroupDirective;
  @ViewChild('formDirectiveK', { static: true }) formDirectiveK: FormGroupDirective;
  @ViewChild('formDirectiveL', { static: true }) formDirectiveL: FormGroupDirective;
  @ViewChild('formDirectiveL2', { static: true }) formDirectiveL2: FormGroupDirective;
  @ViewChild('formDirectiveM', { static: true }) formDirectiveM: FormGroupDirective;
  @ViewChild('formDirectiveM1', { static: true }) formDirectiveM1: FormGroupDirective;
  @ViewChild('formDirectiveM2', { static: true }) formDirectiveM2: FormGroupDirective;
  @ViewChild('formDirectiveM3', { static: true }) formDirectiveM3: FormGroupDirective;
  @ViewChild('formDirectiveN', { static: true }) formDirectiveN: FormGroupDirective;
  @ViewChild('formDirectiveO', { static: true }) formDirectiveO: FormGroupDirective;
  @ViewChild('formDirectiveP', { static: true }) formDirectiveP: FormGroupDirective;
  @ViewChild('formDirectiveQ', { static: true }) formDirectiveQ: FormGroupDirective;
  @ViewChild('formDirectiveR', { static: true }) formDirectiveR: FormGroupDirective;
  @ViewChild('formDirectiveS', { static: true }) formDirectiveS: FormGroupDirective;

  private sectionMembers: SectionMember[];
  //#endregion

  //#region form data

  // tslint:disable: variable-name
  nationality = registryData.nationality;
  H_cathResults = Acsd290Data.H_cathResults;
  J_cabg = Acsd290Data.J_cabg;
  H_vad = Acsd290Data.H_vad;
  M2_priorAoInt = Acsd290Data.M2_priorAoInt;
  M2_device = Acsd290Data.M2_device;
  // tslint:enable: variable-name

  // staffs: Staff[];
  staffs = [];
  cvt: RegSelectChoice[];
  anesth: RegSelectChoice[];
  sn: RegSelectChoice[];
  ctt: RegSelectChoice[];

  toc = Acsd290Toc;

  //#endregion

  avHospitals: string[];
  avHospitalsNullOption = true;

  //#region Progression
  get progressValid() {
    return this.completion ? this.completion.summary.valid : 0;
  }

  get progressTotal() {
    return this.completion ? this.completion.summary.total : 1;
  }

  get progressSummary() {
    return this.completion
      ? this.completion.summary.valid + '/' + this.completion.summary.total
      : '0/0';
  }

  get progressPercent() {
    if (!this.completion) {
      return `(0%)`;
    }

    const completion = Math.floor(
      (this.completion.summary.valid / this.completion.summary.total) * 100
    );
    return `(${completion}%)`;
  }
  //#endregion

  constructor(
    protected store: Store<AppState>,
    protected scrollSpy: ScrollSpyService,
    protected changeDetector: ChangeDetectorRef,
    protected hostElement: ElementRef,
    private registryFormService: RegistryFormService,
    private formBuilder: FormBuilder,
    private acsd290Service: Acsd290Service
  ) {
    super(store, scrollSpy, changeDetector, hostElement);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.createForm();
    this.registryFormService.subscribeFormConditions();
    // this.formGroupQ.controls['DischMortStat'].setValue(
    //   'Discharged alive, last known status is alive'
    // );

    this.subscribeCompletionCalculation();
    this.subscribeSubSectionsChanged();

    this.completion = this.initializeFormCompletion();
    this.formGroupA.get('registryId').setValue('(new)');
    this.firstRunCompletion();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.store.dispatch(AppStoreActions.stopLoading());
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createForm() {
    this.formGroupA = this.formBuilder.group(Acsd290Form.sectionA);
    this.formGroupB = this.formBuilder.group(Acsd290Form.sectionB);
    this.formGroupC = this.formBuilder.group(Acsd290Form.sectionC);
    this.formGroupD = this.formBuilder.group(Acsd290Form.sectionD);
    this.formGroupE = this.formBuilder.group(Acsd290Form.sectionE);
    this.formGroupF = this.formBuilder.group(Acsd290Form.sectionF);
    this.formGroupG = this.formBuilder.group(Acsd290Form.sectionG);
    this.formGroupH = this.formBuilder.group(Acsd290Form.sectionH);
    this.formGroupI = this.formBuilder.group(Acsd290Form.sectionI);
    this.formGroupJ = this.formBuilder.group(Acsd290Form.sectionJ);
    this.formGroupK = this.formBuilder.group(Acsd290Form.sectionK);
    this.formGroupL = this.formBuilder.group(Acsd290Form.sectionL);
    this.formGroupL2 = this.formBuilder.group(Acsd290Form.sectionL2);
    this.formGroupM = this.formBuilder.group(Acsd290Form.sectionM);
    this.formGroupM1 = this.formBuilder.group(Acsd290Form.sectionM1);
    this.formGroupM2 = this.formBuilder.group(Acsd290Form.sectionM2);
    this.formGroupM3 = this.formBuilder.group(Acsd290Form.sectionM3);
    this.formGroupN = this.formBuilder.group(Acsd290Form.sectionN);
    this.formGroupO = this.formBuilder.group(Acsd290Form.sectionO);
    this.formGroupP = this.formBuilder.group(Acsd290Form.sectionP);
    this.formGroupQ = this.formBuilder.group(Acsd290Form.sectionQ);
    this.formGroupR = this.formBuilder.group(Acsd290Form.sectionR);
    this.formGroupS = this.formBuilder.group(Acsd290Form.sectionS);

    this.sectionMembers = [
      ['sectionA', this.formGroupA, this.formDirectiveA, Acsd290Conditions.sectionA],
      ['sectionB', this.formGroupB, this.formDirectiveB, Acsd290Conditions.sectionB],
      ['sectionC', this.formGroupC, this.formDirectiveC, Acsd290Conditions.sectionC],
      ['sectionD', this.formGroupD, this.formDirectiveD, Acsd290Conditions.sectionD],
      ['sectionE', this.formGroupE, this.formDirectiveE, Acsd290Conditions.sectionE],
      ['sectionF', this.formGroupF, this.formDirectiveF, Acsd290Conditions.sectionF],
      ['sectionG', this.formGroupG, this.formDirectiveG, Acsd290Conditions.sectionG],
      ['sectionH', this.formGroupH, this.formDirectiveH, Acsd290Conditions.sectionH],
      ['sectionI', this.formGroupI, this.formDirectiveI, Acsd290Conditions.sectionI],
      ['sectionJ', this.formGroupJ, this.formDirectiveJ, Acsd290Conditions.sectionJ],
      ['sectionK', this.formGroupK, this.formDirectiveK, Acsd290Conditions.sectionK],
      ['sectionL', this.formGroupL, this.formDirectiveL, Acsd290Conditions.sectionL],
      ['sectionL2', this.formGroupL2, this.formDirectiveL2, Acsd290Conditions.sectionL2],
      ['sectionM', this.formGroupM, this.formDirectiveM, Acsd290Conditions.sectionM],
      ['sectionM1', this.formGroupM1, this.formDirectiveM1, Acsd290Conditions.sectionM1],
      ['sectionM2', this.formGroupM2, this.formDirectiveM2, Acsd290Conditions.sectionM2],
      ['sectionM3', this.formGroupM3, this.formDirectiveM3, Acsd290Conditions.sectionM3],
      ['sectionN', this.formGroupN, this.formDirectiveN, Acsd290Conditions.sectionN],
      ['sectionO', this.formGroupO, this.formDirectiveO, Acsd290Conditions.sectionO],
      ['sectionP', this.formGroupP, this.formDirectiveP, Acsd290Conditions.sectionP],
      ['sectionQ', this.formGroupQ, this.formDirectiveQ, Acsd290Conditions.sectionQ],
      ['sectionR', this.formGroupR, this.formDirectiveR, Acsd290Conditions.sectionR],
      ['sectionS', this.formGroupS, this.formDirectiveS, Acsd290Conditions.sectionS],
    ];

    this.registryFormService.initializeForm(
      this.sectionMembers,
      Acsd290Conditions,
      Acsd290Validations,
      this.visibility
    );
    this.registryFormService.setDataDict(require('raw-loader!./acsd290.dict.md').default);
  }

  displaySummary(section: string): string {
    if (!this.completion) {
      return;
    }

    const current = this.completion[section];
    return current.valid + '/' + current.total;
  }

  private initializeFormCompletion(): Acsd290Completion {
    return {
      summary: { valid: 0, total: 0 },
      sectionA: { valid: 0, total: 0 },
      sectionB: { valid: 0, total: 0 },
      sectionC: { valid: 0, total: 0 },
      sectionD: { valid: 0, total: 0 },
      sectionE: { valid: 0, total: 0 },
      sectionF: { valid: 0, total: 0 },
      sectionG: { valid: 0, total: 0 },
      sectionH: { valid: 0, total: 0 },
      sectionI: { valid: 0, total: 0 },
      sectionJ: { valid: 0, total: 0 },
      sectionK: { valid: 0, total: 0 },
      sectionL: { valid: 0, total: 0 },
      sectionL2: { valid: 0, total: 0 },
      sectionM: { valid: 0, total: 0 },
      sectionM1: { valid: 0, total: 0 },
      sectionM2: { valid: 0, total: 0 },
      sectionM3: { valid: 0, total: 0 },
      sectionN: { valid: 0, total: 0 },
      sectionO: { valid: 0, total: 0 },
      sectionP: { valid: 0, total: 0 },
      sectionQ: { valid: 0, total: 0 },
      sectionR: { valid: 0, total: 0 },
      sectionS: { valid: 0, total: 0 },
    };
  }

  private subscribeCompletionCalculation() {
    this.sectionMembers.forEach((sm) => {
      this.subscriptions.push(
        sm[1].valueChanges.subscribe((value) => {
          if (sm[1].disabled) {
            return;
          }

          let newCompletion: FormCompletion;
          newCompletion = this.registryFormService.getSectionCompletion(sm[0]);

          const oldCompletion = this.completion[sm[0]] as FormCompletion;
          this.completion[sm[0]] = newCompletion;

          this.completion.summary.valid =
            this.completion.summary.valid - oldCompletion.valid + newCompletion.valid;
          this.completion.summary.total =
            this.completion.summary.total - oldCompletion.total + newCompletion.total;
        })
      );
    });
  }

  private firstRunCompletion() {
    this.sectionMembers.forEach((sm) => {
      sm[1].enable();
    });
  }

  private subscribeSubSectionsChanged() {
    const subSections = [
      { parentFormGroup: this.formGroupI, control: 'OpCAB', childFormGroup: this.formGroupJ },
      { parentFormGroup: this.formGroupI, control: 'OpValve', childFormGroup: this.formGroupK },
      { parentFormGroup: this.formGroupI, control: 'OpOCard', childFormGroup: this.formGroupM },
      { parentFormGroup: this.formGroupI, control: 'AFibProc', childFormGroup: this.formGroupM1 },
      { parentFormGroup: this.formGroupI, control: 'AortProc', childFormGroup: this.formGroupM2 },
      { parentFormGroup: this.formGroupM, control: 'OCarCong', childFormGroup: this.formGroupM3 },
      { parentFormGroup: this.formGroupI, control: 'OpONCard', childFormGroup: this.formGroupN },
      {
        parentFormGroup: this.formGroupQ,
        control: 'DischMortStat',
        childFormGroup: this.formGroupR,
      },
    ];

    subSections.forEach((el) => {
      this.subscriptions.push(
        el.parentFormGroup
          .get(el.control)
          .valueChanges.subscribe((value) => el.childFormGroup.enable())
      );
    });
  }
}
