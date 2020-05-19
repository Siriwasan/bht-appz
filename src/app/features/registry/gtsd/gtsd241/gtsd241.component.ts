import { Component, OnInit, ChangeDetectorRef, ElementRef, OnDestroy, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormGroupDirective, FormBuilder } from '@angular/forms';

import { RegistryFormComponent } from 'src/app/shared/modules/registry-form/registry-form.component';
import { AppState } from 'src/app/store/root-store.state';
import { ScrollSpyService } from 'src/app/shared/modules/scroll-spy/scroll-spy.service';
import { RegistryFormService } from 'src/app/shared/modules/registry-form/registry-form.service';

import { Gtsd241Form } from './gtsd241.form';
import { Gtsd241Conditions } from './gtsd241.condition';
import {
  SectionMember,
  FormVisibility,
  RegistryCompletion,
  RegSelectChoiceGroup,
  RegSelectChoice,
} from 'src/app/shared/modules/registry-form/registry-form.model';
import { Gtsd241Validations } from './gtsd241.validation';
import { Gtsd241Service } from './gtsd241.service';
import { getTocTitle } from '../../gtsd/gtsd241/gtsd241.toc';
import * as registryData from '../../registry.data';
import { Subscription } from 'rxjs';
import { Gtsd241Toc } from './gtsd241.toc';
import { FormDetail } from '../../registry.model';
import * as gtsd241Data from './gtsd241.data';

@Component({
  selector: 'app-gtsd241',
  templateUrl: './gtsd241.component.html',
  styleUrls: ['./gtsd241.component.scss'],
  providers: [Gtsd241Service],
})
export class Gtsd241Component extends RegistryFormComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  //#region Form function
  private subscriptions: Subscription[] = [];
  controlService = this.registryFormService;
  //#endregion

  //#region Html
  visibility: FormVisibility = {};
  progressValid: number;
  progressTotal: number;
  progressSummary: string;
  progressPercent: string;
  private completion: RegistryCompletion;
  //#endregion

  //#region Form data
  toc = Gtsd241Toc;
  tocTitle = getTocTitle;
  avHospitalsNullOption = false;
  nationality = registryData.nationality;
  diagnosis: RegSelectChoice[] = [];
  procedure: RegSelectChoice[] = [];
  //#endregion

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
  formGroupM: FormGroup;
  formGroupN: FormGroup;
  formGroupO: FormGroup;

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
  @ViewChild('formDirectiveM', { static: true }) formDirectiveM: FormGroupDirective;
  @ViewChild('formDirectiveN', { static: true }) formDirectiveN: FormGroupDirective;
  @ViewChild('formDirectiveO', { static: true }) formDirectiveO: FormGroupDirective;

  private sectionMembers: SectionMember[];
  //#endregion

  constructor(
    protected store: Store<AppState>,
    protected scrollSpy: ScrollSpyService,
    protected changeDetector: ChangeDetectorRef,
    protected hostElement: ElementRef,
    private registryFormService: RegistryFormService,
    private formBuilder: FormBuilder,
    private gtsd241Service: Gtsd241Service
  ) {
    super(store, scrollSpy, changeDetector, hostElement);
  }

  ngOnInit() {
    super.ngOnInit();

    gtsd241Data.diagnosis.forEach((dx) => {
      this.diagnosis.push({
        value: dx.name,
        label: dx.name,
        group: dx.category,
        disable: false,
      });
    });

    gtsd241Data.procedure.forEach((rx) => {
      this.procedure.push({
        value: rx.name,
        label: rx.name,
        group: rx.category,
        disable: false,
      });
    });
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.createForm();
    this.formGroupA.get('registryId').setValue('(new)');

    // this.visibility['sectionJBody'] = true;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // this.store.dispatch(AppStoreActions.stopLoading());
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createForm() {
    this.formGroupA = this.formBuilder.group(Gtsd241Form.sectionA);
    this.formGroupB = this.formBuilder.group(Gtsd241Form.sectionB);
    this.formGroupC = this.formBuilder.group(Gtsd241Form.sectionC);
    this.formGroupD = this.formBuilder.group(Gtsd241Form.sectionD);
    this.formGroupE = this.formBuilder.group(Gtsd241Form.sectionE);
    this.formGroupF = this.formBuilder.group(Gtsd241Form.sectionF);
    this.formGroupG = this.formBuilder.group(Gtsd241Form.sectionG);
    this.formGroupH = this.formBuilder.group(Gtsd241Form.sectionH);
    this.formGroupI = this.formBuilder.group(Gtsd241Form.sectionI);
    this.formGroupJ = this.formBuilder.group(Gtsd241Form.sectionJ);
    this.formGroupK = this.formBuilder.group(Gtsd241Form.sectionK);
    this.formGroupL = this.formBuilder.group(Gtsd241Form.sectionL);
    this.formGroupM = this.formBuilder.group(Gtsd241Form.sectionM);
    this.formGroupN = this.formBuilder.group(Gtsd241Form.sectionN);
    this.formGroupO = this.formBuilder.group(Gtsd241Form.sectionO);

    this.sectionMembers = [
      ['sectionA', this.formGroupA, this.formDirectiveA, Gtsd241Conditions.sectionA],
      ['sectionB', this.formGroupB, this.formDirectiveB, Gtsd241Conditions.sectionB],
      ['sectionC', this.formGroupC, this.formDirectiveC, Gtsd241Conditions.sectionC],
      ['sectionD', this.formGroupD, this.formDirectiveD, Gtsd241Conditions.sectionD],
      ['sectionE', this.formGroupE, this.formDirectiveE, Gtsd241Conditions.sectionE],
      ['sectionF', this.formGroupF, this.formDirectiveF, Gtsd241Conditions.sectionF],
      ['sectionG', this.formGroupG, this.formDirectiveG, Gtsd241Conditions.sectionG],
      ['sectionH', this.formGroupH, this.formDirectiveH, Gtsd241Conditions.sectionH],
      ['sectionI', this.formGroupI, this.formDirectiveI, Gtsd241Conditions.sectionI],
      ['sectionJ', this.formGroupJ, this.formDirectiveJ, Gtsd241Conditions.sectionJ],
      ['sectionK', this.formGroupK, this.formDirectiveK, Gtsd241Conditions.sectionK],
      ['sectionL', this.formGroupL, this.formDirectiveL, Gtsd241Conditions.sectionL],
      ['sectionM', this.formGroupM, this.formDirectiveM, Gtsd241Conditions.sectionM],
      ['sectionN', this.formGroupN, this.formDirectiveN, Gtsd241Conditions.sectionN],
      ['sectionO', this.formGroupO, this.formDirectiveO, Gtsd241Conditions.sectionO],
    ];

    this.registryFormService.initializeForm(this.sectionMembers, Gtsd241Conditions, Gtsd241Validations, this.visibility);
    this.registryFormService.setDataDict(require('raw-loader!./gtsd241.dict.md').default);
    this.registryFormService.subscribeFormConditions();

    this.subscribeSubSectionsChanged();
    this.subscribeCompletion();
  }

  sectionCompletion(section: string) {
    return this.completion ? this.completion[section].valid + '/' + this.completion[section].total : null;
  }

  private subscribeCompletion() {
    this.subscriptions.push(
      this.registryFormService.getRegistryCompletion().subscribe((completion) => {
        this.progressValid = completion ? completion.summary.valid : 0;
        this.progressTotal = completion ? completion.summary.total : 1;
        this.progressSummary = completion ? completion.summary.valid + '/' + completion.summary.total : '0/0';
        const percent = Math.floor((completion.summary.valid / completion.summary.total) * 100);
        this.progressPercent = `(${percent}%)`;
        this.completion = completion;
      })
    );
  }

  private subscribeSubSectionsChanged() {
    const subSections = [
      { parentFormGroup: this.formGroupE, control: 'LungCancer', childFormGroup: this.formGroupF },
      { parentFormGroup: this.formGroupE, control: 'EsophCancer', childFormGroup: this.formGroupG },
      { parentFormGroup: this.formGroupE, control: 'ThymusMediastinalData', childFormGroup: this.formGroupH },
      { parentFormGroup: this.formGroupE, control: 'TrachealData', childFormGroup: this.formGroupI },
      { parentFormGroup: this.formGroupE, control: 'HiatalHerniaData', childFormGroup: this.formGroupJ },
    ];

    subSections.forEach((el) => {
      this.subscriptions.push(el.parentFormGroup.get(el.control).valueChanges.subscribe((value) => el.childFormGroup.enable()));
    });
  }
}
