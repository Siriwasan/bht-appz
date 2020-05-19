import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormGroupDirective, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import * as marked from 'marked';

import { IRegistryControlService } from 'src/app/shared/modules/registry-form/registry-control-service.interface';
import { DialogService } from '../../services/dialog.service';
import {
  ValidationMessage,
  FormValidations,
  FormConditions,
  SectionMember,
  ControlCondition,
  FormCompletion,
  FormVisibility,
  RegistryCompletion,
} from './registry-form.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class RegistryFormService implements IRegistryControlService, OnDestroy {
  //#region Data Dictionary variables
  private dataDict: string;
  private tokens: marked.TokensList;
  //#endregion Data Dictionary variables

  private subscriptions: Subscription[] = [];

  private sectionMembers: SectionMember[];
  private conditions: FormConditions;
  private validations: FormValidations;

  private visibility: FormVisibility = {};
  private complete = new BehaviorSubject<RegistryCompletion>(null);

  constructor(private dialogService: DialogService, private afs: AngularFirestore) {}

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  //#region Registry
  public initializeForm(
    sectionMembers: SectionMember[],
    conditions: FormConditions,
    validations: FormValidations,
    visibility: FormVisibility
  ) {
    this.sectionMembers = sectionMembers;
    this.conditions = conditions;
    this.validations = validations;
    this.visibility = visibility;

    // move to child form ngAfterViewInit
    // this.subscribeFormConditions();
  }

  // ! need to subscribe in ngAfterViewInit
  public subscribeFormConditions() {
    this.getSectionMembers().forEach((sectionMember) => {
      this.subscribeValueChanges(sectionMember[1], sectionMember[3], this.visibility); // FormGroup, ControlCondition[]
    });

    // ! initial remove validator in hiding child control
    // this.getFormGroups().forEach((formGroup) => formGroup.setValue(formGroup.value));

    this.initializeFormCompletion();
    this.subscribeCompletionCalculation();
    this.firstRunCompletion();
  }

  public subscribeValueChanges(formGroup: FormGroup, conditions: ControlCondition[], visibility: FormVisibility) {
    conditions.forEach((condition) => {
      let parentControl: AbstractControl;
      const pCon = condition.parentControl.split(':'); // section : control

      if (pCon.length > 1) {
        parentControl = this.getFormGroup(pCon[0]).get(pCon[1]);
      } else {
        parentControl = formGroup.get(condition.parentControl);
      }

      this.subscriptions.push(
        parentControl.valueChanges.subscribe((value) => {
          const element = condition.control;
          let visibled: boolean;

          if (value === null) {
            // NULL condition
            visibled = false;
          } else if (condition.conditions[0] === '!') {
            // NOT condition
            if (Array.isArray(value) && value.length === 0) {
              value = null;
            }
            visibled = condition.conditions[1] !== value;
          } else if (condition.conditions[0] === '@') {
            // CONTAIN condition
            visibled = value.findIndex((o) => o === condition.conditions[1]) >= 0;
          } else {
            visibled = condition.conditions.findIndex((o) => o === value) >= 0;
          }
          const control = formGroup.get(condition.control);
          if (control && visibled === false) {
            control.reset();
          }
          this.displayElement(element, visibility, visibled);
        })
      );
    });
  }

  private displayElement(element: string, visibility: FormVisibility, visibled: boolean) {
    visibility[element] = visibled;
  }

  private getSectonMember(section: string): SectionMember {
    if (section === null) {
      return this.sectionMembers[0];
    }
    return this.sectionMembers.find((o) => o[0] === section);
  }

  private getSectionMembers(): SectionMember[] {
    return this.sectionMembers;
  }

  public getFormGroup(section: string): FormGroup {
    const sectionMember = this.getSectonMember(section);
    if (sectionMember === undefined) {
      return null;
    }
    return sectionMember[1]; // FormGroup
  }

  private getFormGroups(): FormGroup[] {
    return this.sectionMembers.map((sectionMember) => sectionMember[1]);
  }

  private getFormConditions(section: string): ControlCondition[] {
    const sectionMember = this.getSectonMember(section);
    if (sectionMember === undefined) {
      return null;
    }
    return sectionMember[3]; // ControlCondition[]
  }

  private getFormDirective(section: string): FormGroupDirective {
    const sectionMember = this.getSectonMember(section);
    if (sectionMember === undefined) {
      return null;
    }
    return sectionMember[2]; // FormGroupDirective
  }

  private getFormDirectives(): FormGroupDirective[] {
    console.log(this.sectionMembers);
    return this.sectionMembers.map((sectionMember) => sectionMember[2]);
  }

  getInvalidMessages(formGroup: FormGroup, control: string): ValidationMessage[] {
    let vals: ValidationMessage[] = [];
    const invalidVals: ValidationMessage[] = [];

    Object.entries(this.validations).find(([key, value]) => {
      const result = Object.entries(value).find(([key2, value2]) => key2 === control);
      if (result === undefined) {
        return false;
      }
      vals = result[1];
      return true;
    });

    vals.forEach((val) => {
      if (formGroup.get(control).hasError(val.type)) {
        invalidVals.push(val);
      }
    });

    return invalidVals;
  }

  public getControlSection(control: string): string {
    let section: string;

    // find control's section
    Object.entries(this.validations).find(([key, value]) => {
      const result = Object.entries(value).find(([key2, value2]) => key2 === control);
      if (result === undefined) {
        return false;
      }
      // section = key === 'section' ? null : key.substr(7); // 'section'.lenght
      section = key;
      return true;
    });

    return section;
  }

  public getSectionCompletion(section: string): FormCompletion {
    const formGroup = this.getFormGroup(section);
    return this.checkCompletion(formGroup, this.visibility);
  }

  // Recursive
  public checkCompletion(formGroup: FormGroup, visible: FormVisibility): FormCompletion {
    let val = 0;
    let totl = 0;

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof FormArray) {
        (control as FormArray).controls.forEach((fg: FormGroup, index: number) => {
          const completion = this.checkCompletion(fg, visible[key][index]);
          val += completion.valid;
          totl += completion.total;
        });
        return;
      }

      if (visible[key] !== false) {
        val += control.errors ? 0 : 1;
        totl++;
      }
    });

    return { valid: val, total: totl };
  }

  public isFormDirty(): boolean {
    let isDirty = false;
    this.getFormGroups().forEach((formGroup) => (isDirty = isDirty || formGroup.dirty));
    return isDirty;
  }

  public disableAllForms() {
    this.getFormGroups().forEach((formGroup) => formGroup.disable());
  }

  public markAllFormsUntouched() {
    // this.getFormGroups().forEach(formGroup => this.markAllAsUntouched(formGroup));
    this.getFormGroups().forEach((formGroup) => formGroup.markAsPristine());
  }

  public submitAllSections() {
    // this.getFormDirectives().forEach(formDirective => formDirective.onSubmit(undefined));
    // this.getFormGroups().forEach(formGroup => this.validateAllFields(formGroup));
    this.getFormGroups().forEach((formGroup) => formGroup.markAllAsTouched());
  }

  // validateAllFields(formGroup: FormGroup | FormArray) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof FormControl) {
  //       control.markAsTouched({ onlySelf: true });
  //     } else if (control instanceof FormGroup) {
  //       this.validateAllFields(control);
  //     }
  //   });
  // }

  public clear() {
    console.log(this.getFormDirectives());
    this.getFormDirectives().forEach((formDirective) => formDirective.resetForm());
  }

  public clearErrors() {
    this.getSectionMembers().forEach((sectionMember) => sectionMember[2].resetForm(sectionMember[1].value));
  }

  getRegistryCompletion(): Observable<RegistryCompletion> {
    return this.complete.asObservable();
  }

  private initializeFormCompletion() {
    const allCompletion: RegistryCompletion = {};
    allCompletion[`summary`] = { valid: 0, total: 0 };
    this.sectionMembers.forEach((sm) => {
      allCompletion[sm[0]] = { valid: 0, total: 0 };
    });
    this.complete.next(allCompletion);
  }

  private subscribeCompletionCalculation() {
    this.sectionMembers.forEach((sm) => {
      this.subscriptions.push(
        sm[1].valueChanges.subscribe((value) => {
          if (sm[1].disabled) {
            return;
          }

          let newCompletion: FormCompletion;
          newCompletion = this.getSectionCompletion(sm[0]);

          const allCompletion = this.complete.getValue();
          const oldCompletion = allCompletion[sm[0]] as FormCompletion;
          allCompletion[sm[0]] = newCompletion;

          allCompletion.summary.valid = allCompletion.summary.valid - oldCompletion.valid + newCompletion.valid;
          allCompletion.summary.total = allCompletion.summary.total - oldCompletion.total + newCompletion.total;

          this.complete.next(allCompletion);
        })
      );
    });
  }

  private firstRunCompletion() {
    this.sectionMembers.forEach((sm) => {
      sm[1].enable();
    });
  }

  //#endregion Registry

  //#region Data Dictionary
  public setDataDict(dataDict: string) {
    this.dataDict = dataDict;
    this.tokens = marked.lexer(this.dataDict);
  }

  public hasInfo(control: string) {
    if (!this.tokens) {
      return;
    }

    return (
      this.tokens.findIndex((token) => {
        if (token.type === 'heading') {
          const heading = token as marked.Tokens.Heading;
          if (heading.depth === 1 && heading.text === control) {
            return true;
          }
        }
        return false;
      }) > -1
    );
  }

  public openInfo(control: string) {
    if (!this.tokens) {
      return;
    }

    this.dialogService.createModalDialog({
      title: null,
      content: this.searhDataDict(control),
      buttons: ['Close'],
    });
  }

  private searhDataDict(key: string): string {
    let index = 0;
    const mdBlock: marked.Token[] = [];

    // Seek index of target h1
    while (index < this.tokens.length) {
      const token = this.tokens[index];

      if (token.type === 'heading') {
        const heading = token as marked.Tokens.Heading;

        if (heading.depth === 1 && heading.text === key) {
          break;
        }
      }

      index++;
    }

    // Get block of target h1
    index++;
    while (index < this.tokens.length) {
      // const token = this.tokens[index];
      mdBlock.push(this.tokens[index]);
      index++;

      if (this.tokens[index] === undefined) {
        break;
      }

      if (this.tokens[index].type === 'heading' && (this.tokens[index] as marked.Tokens.Heading).depth === 1) {
        break;
      }
    }

    let tokensList: marked.TokensList;
    tokensList = Object.assign(mdBlock, { links: this.tokens.links });
    return marked.parser(tokensList);
  }
  //#endregion Data Dictionary
}
