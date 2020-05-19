import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { RegistryControlComponent } from './registry-control.component';
import { RegSelectChoice, RegSelectChoiceGroup } from '../registry-form.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'reg-select',
  template: `
    <mat-form-field [formGroup]="formGroup" style="width: 100%">
      <mat-select
        [formControlName]="controlName"
        name="controlName"
        [placeholder]="placeholder"
        [required]="require"
        (selectionChange)="selectionChange($event)"
      >
        <mat-option *ngIf="nullOption" [value]="null">--</mat-option>
        <div *ngIf="group; else no_group">
          <mat-optgroup *ngFor="let group of regSelectChoiceGroups" [label]="group.name">
            <mat-option
              *ngFor="let choice of group.choices"
              [value]="choice.value"
              [disabled]="choice.disable"
            >
              {{ choice.label }}
              <div *ngIf="choice.detailHtml">
                <span class="detail-html" [innerHTML]="choice.detailHtml"></span>
              </div>
            </mat-option>
          </mat-optgroup>
        </div>
        <ng-template #no_group>
          <mat-option
            *ngFor="let choice of regSelectChoices"
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
export class RegistrySelectComponent extends RegistryControlComponent implements OnInit, OnChanges {
  @Input() nullOption = true;
  @Input() sortChoice = ''; // asc, desc
  @Input() sortGroup = ''; // asc, desc
  @Input() group = false;
  @Input() choices: string[] | number[] | RegSelectChoice[];
  @Output() choiceChange: EventEmitter<MatSelectChange> = new EventEmitter();

  regSelectChoices: RegSelectChoice[] = [];
  regSelectChoiceGroups: RegSelectChoiceGroup[] = [];

  constructor(protected elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();
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
  }

  selectionChange(event: MatSelectChange) {
    this.choiceChange.emit(event);
  }
}
