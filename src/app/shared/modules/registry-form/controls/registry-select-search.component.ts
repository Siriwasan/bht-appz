import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange, MatSelect } from '@angular/material/select';

import { RegistryControlComponent } from './registry-control.component';
import { RegSelectChoice, RegSelectChoiceGroup } from '../registry-form.model';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'reg-select-search',
  template: `
    <mat-form-field class="item" [formGroup]="formGroup" style="width: 100%">
      <mat-select
        [formControlName]="controlName"
        [required]="require"
        [placeholder]="placeholder"
        (selectionChange)="selectionChange($event)"
        #singleSelect
      >
        <mat-select-trigger>
          {{ outputLabel }}
        </mat-select-trigger>
        <mat-option>
          <ngx-mat-select-search
            placeholderLabel="Choose..."
            noEntriesFoundLabel="No result"
            [formControl]="filterCtrl"
          ></ngx-mat-select-search>
        </mat-option>
        <mat-option *ngIf="nullOption" [value]="null">--</mat-option>
        <div *ngIf="group; else no_group">
          <mat-optgroup *ngFor="let group of filteredChoiceGroups | async" [label]="group.name">
            <mat-option
              *ngFor="let choice of group.choices"
              [value]="choice.value"
              [disabled]="choice.disable"
            >
              {{ choice.altLabel ? choice.altLabel : choice.label }}
              <div *ngIf="choice.detailHtml">
                <span class="detail-html" [innerHTML]="choice.detailHtml"></span>
              </div>
            </mat-option>
          </mat-optgroup>
        </div>
        <ng-template #no_group>
          <mat-option
            *ngFor="let choice of filteredChoices | async"
            [value]="choice.value"
            [disabled]="choice.disable"
          >
            {{ choice.label }}
            <div *ngIf="choice.detailHtml">
              <span class="detail-html" [innerHTML]="choice.detailHtml"></span>
            </div>
          </mat-option>
        </ng-template>
      </mat-select>
      <mat-hint>
        <a><ng-content></ng-content></a>
        <mat-icon style="cursor: help;" (click)="openInfo(controlName)" *ngIf="bInfo">
          info_outline
        </mat-icon>
      </mat-hint>
      <mat-error *ngIf="self.invalid && (self.dirty || self.touched)">
        <div *ngFor="let validation of getInvalidMessages(formGroup, controlName)">
          <a>{{ validation.message }}</a>
        </div>
        <mat-icon style="cursor: help;" (click)="openInfo(controlName)" *ngIf="bInfo">
          info_outline
        </mat-icon>
      </mat-error>
    </mat-form-field>
  `,
  styleUrls: ['./registry-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrySelectSearchComponent extends RegistryControlComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() nullOption = true;
  @Input() sortChoice = ''; // asc, desc
  @Input() sortGroup = ''; // asc, desc
  @Input() group = false;
  @Input() choices: string[] | number[] | RegSelectChoice[];
  @Output() choiceChange: EventEmitter<MatSelectChange> = new EventEmitter();

  get outputLabel() {
    if (this.self.value === null) {
      return '';
    }
    const result = this.regSelectChoices.find((c) => c.value === this.self.value);
    return result ? result.label : null;
  }

  regSelectChoices: RegSelectChoice[] = [];
  regSelectChoiceGroups: RegSelectChoiceGroup[] = [];
  htm = '<strong>Test</strong>';

  /** control for the MatSelect filter keyword */
  public filterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredChoices: ReplaySubject<RegSelectChoice[]> = new ReplaySubject<RegSelectChoice[]>(
    1
  );
  public filteredChoiceGroups: ReplaySubject<RegSelectChoiceGroup[]> = new ReplaySubject<
    RegSelectChoiceGroup[]
  >(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroySubject = new Subject<void>();

  constructor(protected elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();

    // listen for search field value changes
    this.filterCtrl.valueChanges.pipe(takeUntil(this.onDestroySubject)).subscribe(() => {
      if (this.group) {
        this.filterChoiceGroups();
      } else {
        this.filterChoices();
      }
    });
  }

  ngAfterViewInit() {
    // this.setInitialValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.choices) {
      this.regSelectChoices = [];
      this.regSelectChoiceGroups = [];

      if (!this.choices) {
        return;
      }
      switch (typeof this.choices[0]) {
        case 'string':
        case 'number':
          this.choices.forEach((c) => {
            this.regSelectChoices.push({ label: c, value: c, disable: false });
          });
          break;
        default:
          this.regSelectChoices = this.choices as RegSelectChoice[];
          break;
      }

      this.sortRegSelectChoices();
      this.arrangeChoicesToGroups();
      this.sortRegSelectChoiceGroups();
    }
  }

  private arrangeChoicesToGroups() {
    if (this.group) {
      this.regSelectChoices.forEach(
        ((group: RegSelectChoiceGroup) => {
          return (choice: RegSelectChoice) => {
            if (!group[choice.group]) {
              group[choice.group] = { name: choice.group, choices: [] };
              this.regSelectChoiceGroups.push(group[choice.group]);
            }
            group[choice.group].choices.push(choice);
          };
        })(Object.create(null))
      );
    }
  }

  private sortRegSelectChoices() {
    if (this.sortChoice === 'asc') {
      this.regSelectChoices = this.regSelectChoices.sort((a, b) => (a.label < b.label ? -1 : 1));
    } else if (this.sortChoice === 'desc') {
      this.regSelectChoices = this.regSelectChoices.sort((a, b) => (a.label > b.label ? -1 : 1));
    }
    this.filteredChoices.next(this.regSelectChoices.slice());
  }

  private sortRegSelectChoiceGroups() {
    if (this.sortGroup === 'asc') {
      this.regSelectChoiceGroups = this.regSelectChoiceGroups.sort((a, b) =>
        a.name < b.name ? -1 : 1
      );
    } else if (this.sortGroup === 'desc') {
      this.regSelectChoiceGroups = this.regSelectChoiceGroups.sort((a, b) =>
        a.name > b.name ? -1 : 1
      );
    }
    this.filteredChoiceGroups.next(this.regSelectChoiceGroups.slice());
  }

  ngOnDestroy() {
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }

  selectionChange(event: MatSelectChange) {
    this.choiceChange.emit(event);
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredChoices.pipe(take(1), takeUntil(this.onDestroySubject)).subscribe(() => {
      // setting the compareWith property to a comparison function
      // triggers initializing the selection according to the initial value of
      // the form control (i.e. _initializeSelection())
      // this needs to be done after the filteredBanks are loaded initially
      // and after the mat-option elements are available
      this.singleSelect.compareWith = (a: RegSelectChoice, b: RegSelectChoice) =>
        a && b && a.value === b.value;
    });
  }

  private filterChoices() {
    if (!this.choices) {
      return;
    }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredChoices.next(this.regSelectChoices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    const result = this.regSelectChoices.filter(
      (choice) =>
        choice.label.toString().toLowerCase().includes(search) ||
        (choice.detailHtml && choice.detailHtml.toString().toLowerCase().includes(search))
    );
    this.filteredChoices.next(result);
  }

  private filterChoiceGroups() {
    if (!this.choices) {
      return;
    }
    // get the search keyword
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredChoiceGroups.next(this.regSelectChoiceGroups.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    const regSelectChoiceGroupsCopy = this.copyRegSelectChoiceGroups(this.regSelectChoiceGroups);

    const result = regSelectChoiceGroupsCopy.filter((group) => {
      const showGroup = group.name.toLowerCase().indexOf(search) > -1;
      if (!showGroup) {
        group.choices = group.choices.filter(
          (choice) =>
            choice.label.toString().toLowerCase().includes(search) ||
            (choice.detailHtml && choice.detailHtml.toString().toLowerCase().includes(search))
        );
      }
      return group.choices.length > 0;
    });
    this.filteredChoiceGroups.next(result);
  }

  private copyRegSelectChoiceGroups(group: RegSelectChoiceGroup[]) {
    const groupCopy = [];
    group.forEach((g) => {
      groupCopy.push({
        name: g.name,
        choices: g.choices.slice(),
      });
    });
    return groupCopy;
  }
}
