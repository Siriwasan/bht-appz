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
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

import { ScrollSpyService } from '../../../shared/modules/scroll-spy/scroll-spy.service';
import { RegistryFormComponent } from 'src/app/shared/modules/registry-form/registry-form.component';
import { AppState } from 'src/app/store/root-store.state';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import * as deepDiff from 'deep-diff';
import * as moment from 'moment';

const AFK_TIMEOUT = 300000;
const VALUECHANGED_DELAY = 5000;

import {
  FormVisibility,
  SectionMember,
  RegSelectChoice,
} from 'src/app/shared/modules/registry-form/registry-form.model';
import { RegistryFormService } from 'src/app/shared/modules/registry-form/registry-form.service';
import { TestForm3Conditions } from './test-form3.condition';
import { TestForm3Validations } from './test-form3.validation';
import { TestForm3Form } from './test-form3.form';
import { TestForm3Service } from './test-form3.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-form3',
  templateUrl: './test-form3.component.html',
  styleUrls: ['./test-form3.component.scss'],
  providers: [TestForm3Service],
})
export class TestForm3Component extends RegistryFormComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  visibility: FormVisibility = {};
  private subscriptions: Subscription[] = [];
  controlService = this.registryFormService;
  private afkTimeoutHandle: NodeJS.Timeout;
  private lastUpdateData: any;

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
    private testForm3Service: TestForm3Service,
    private afs: AngularFirestore,
    private route: Router
  ) {
    super(store, scrollSpy, changeDetector, hostElement);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscribeDataNotification();
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.createForm();
    this.registryFormService.subscribeFormConditions();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.resetAfkTimeout();
    this.subscribeUpdateFirebaseData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createForm() {
    this.formGroupA = this.formBuilder.group(TestForm3Form.sectionA);
    this.formGroupB = this.formBuilder.group(TestForm3Form.sectionB);
    // this.formGroupC = this.formBuilder.group(TestForm3Form.sectionC);

    this.sectionMembers = [
      ['sectionA', this.formGroupA, this.formDirectiveA, TestForm3Conditions.sectionA],
      ['sectionB', this.formGroupB, this.formDirectiveB, TestForm3Conditions.sectionB],
      // ['sectionC', this.formGroupC, this.formDirectiveC, TestForm3Conditions.sectionC],
    ];

    this.registryFormService.initializeForm(
      this.sectionMembers,
      TestForm3Conditions,
      TestForm3Validations,
      this.visibility
    );
    this.registryFormService.setDataDict(require('raw-loader!./test-form3.dict.md').default);
  }

  private subscribeDataNotification() {
    this.subscriptions.push(
      this.afs
        .doc('/Test/7jmOukWx9wjoQxXrOndJ')
        .snapshotChanges()
        .subscribe((action) => {
          const firebaseData = action.payload.data() as {};
          // console.log('notify form Firebase:', this.lastUpdateData, firebaseData);

          const diffs = deepDiff.diff(this.lastUpdateData, firebaseData);
          console.log(diffs);

          if (!diffs) {
            console.log('notify form Firebase:Not different');
            return;
          }

          diffs.forEach((diff) => {
            switch (diff.kind) {
              case 'N':
                const diffNew = diff as deepDiff.DiffNew<any>;

                Object.keys(diffNew.rhs).forEach((section) => {
                  const formGroup = this.registryFormService.getFormGroup(section);
                  formGroup.patchValue(diffNew.rhs[section]);
                });

                break;
              case 'E':
                const diffEdit = diff as deepDiff.DiffEdit<any, any>;
                const formGroup2 = this.registryFormService.getFormGroup(diffEdit.path[0]);
                const control = diffEdit.path[1];

                const obj = {};
                obj[control] = diffEdit.rhs;
                formGroup2.patchValue(obj);

                this.blinkControl(control);
                break;
              default:
                console.log('Diff other than Edit, New');
                break;
            }
          });

          this.lastUpdateData = firebaseData;
        })
    );
  }

  private blinkControl(control: string) {
    setTimeout(() => {
      document.getElementById(control)?.classList.add('value-changed');
      setTimeout(() => {
        document.getElementById(control)?.classList.remove('value-changed');
      }, 1300);
    }, 0);
  }

  private subscribeUpdateFirebaseData() {
    this.sectionMembers.forEach((sm) => {
      this.subscriptions.push(
        sm[1].valueChanges
          .pipe(debounceTime(VALUECHANGED_DELAY), distinctUntilChanged())
          .subscribe((value) => {
            const section = sm[0];

            const serializedValue = this.serializeSectionValue(section, value);
            // console.log(`form changed: ${section}`, this.lastUpdateData, serializedValue);

            const diffs = deepDiff.diff(this.lastUpdateData[section], serializedValue);
            console.log(diffs);

            if (!diffs) {
              console.log(`form changed: ${section} Not different`);
              return;
            }

            const changedValue = {};

            diffs?.forEach((diff) => {
              switch (diff.kind) {
                case 'E':
                  const diffEdit = diff as deepDiff.DiffEdit<any, any>;
                  changedValue[section + '.' + diffEdit.path[0]] = diffEdit.rhs;
                  break;
                default:
                  console.log('Diff other than Edit');
                  break;
              }
            });

            console.log(changedValue);
            this.afs.doc('Test/7jmOukWx9wjoQxXrOndJ').update(changedValue);

            this.lastUpdateData[section] = serializedValue;
            this.resetAfkTimeout();
          })
      );
    });
  }

  private serializeDate(dateTime: any): any {
    const dt = moment.isMoment(dateTime) ? dateTime : moment(dateTime);
    return dt.startOf('day').toISOString(true);
  }

  private serializeSectionValue(section: string, value: any) {
    switch (section) {
      case 'sectionA':
        return { ...value, DOB: this.serializeDate(value[`DOB`]) };
      case 'sectionB':
        return { ...value };
      default:
        return;
    }
  }

  private resetAfkTimeout() {
    clearTimeout(this.afkTimeoutHandle);
    this.afkTimeoutHandle = setTimeout(() => {
      this.route.navigateByUrl('/login');
    }, AFK_TIMEOUT);
  }
}
