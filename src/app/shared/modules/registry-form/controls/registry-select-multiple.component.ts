import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { RegistryControlComponent } from './registry-control.component';
import { RegSelectChoice } from '../registry-form.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'reg-select-multiple',
  template: `
    <mat-form-field class="item" [formGroup]="formGroup" style="width: 100%">
      <mat-select
        [formControlName]="controlName"
        [required]="require"
        [placeholder]="placeholder"
        (selectionChange)="selectionChange($event)"
        multiple
      >
        <mat-select-trigger>
          {{ outputLabel }}
          <span
            *ngIf="limit > 0 && self.value?.length > limit"
            class="mat-select-additional-selection"
          >
            (+{{ self.value.length - limit }}
            {{ self.value.length === +limit + 1 ? 'other' : 'others' }})
          </span>
        </mat-select-trigger>
        <mat-option
          *ngFor="let choice of regSelectChoices"
          [value]="choice.value"
          [disabled]="choice.disable"
        >
          {{ choice.altLabel ? choice.altLabel : choice.label }}
        </mat-option>
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
})
export class RegistrySelectMultipleComponent extends RegistryControlComponent
  implements OnInit, OnChanges {
  @Input() controlName: string;
  @Input() formGroup: FormGroup;
  @Input() placeholder: string;
  @Input() require = true;
  @Input() limit = 0;
  @Input() choices: string[] | number[] | RegSelectChoice[];
  @Output() choiceChange: EventEmitter<MatSelectChange> = new EventEmitter();

  get outputLabel() {
    if (this.self.value === null || this.self.value.length <= 0) {
      return '';
    }

    const out = (arr: []) => {
      let output = '';
      arr.forEach((v) => {
        const choice = this.regSelectChoices.find((c) => c.value === v);

        if (!choice) {
          return;
        }
        output = output + choice.label + ', ';
      });
      output = output.substring(0, output.length - 2);
      return output;
    };

    if (this.limit > 0) {
      return out(this.self.value.slice(0, this.limit));
    }

    return out(this.self.value);
  }

  regSelectChoices: RegSelectChoice[] = [];

  constructor(protected elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.choices) {
      this.regSelectChoices = [];
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
    }
  }

  selectionChange(event: MatSelectChange) {
    if (this.self.value.length === 0) {
      this.self.reset();
    }
    this.choiceChange.emit(event);
  }
}
