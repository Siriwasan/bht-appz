import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Store } from '@ngrx/store';

import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import * as moment from 'moment';

import { AppState } from 'src/app/store/root-store.state';
import { AppStoreActions, AppStoreSelectors } from 'src/app/store/app';
import { RegistryModel } from '../registry.model';
import { registries } from './gtsd.mock';
import { DialogService } from 'src/app/shared/services/dialog.service';

const dateRegEx = `(?:(?:(?:31\/(?:0?[13578]|1[02]))\/|(?:(?:29|30)\/(?:0?[13-9]|1[0-2])\/))(?:(?:1[6-9]|[2-9]\\d)\\d{2})|(?:29\/0?2\/(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))|(?:0?[1-9]|1\\d|2[0-8])\/(?:(?:0?[1-9])|(?:1[0-2]))\/(?:(?:1[6-9]|[2-9]\\d)\\d{2}))`;
const datePattern = new RegExp(`^${dateRegEx}$`);
const dateOperatorPattern = new RegExp(`^[<>]=?\\s*${dateRegEx}$`);
const dateRangePattern = new RegExp(`^${dateRegEx}\\s*-\\s*${dateRegEx}$`);

const ageRegEx = '(?!(0))[0-9]{1,2}\\s*[yY]';
const agePattern = new RegExp(`^${ageRegEx}$`);
const ageOperatorPattern = new RegExp(`^[<>]=?\\s*${ageRegEx}$`);
const ageRangePattern = new RegExp(`^${ageRegEx.replace(/\[yY\]/g, '')}\\s*-\\s*${ageRegEx}$`);

const completionRegEx = '((?:(?!(0))[0-9]{1,2})|100)\\s*%';
const completionPattern = new RegExp(`^${completionRegEx}$`);
const completionOperatorPattern = new RegExp(`^[<>]=?\\s*${completionRegEx}$`);
const completionRangePattern = new RegExp(`^${completionRegEx.replace(/%/g, '')}\\s*-\\s*${completionRegEx}$`);

const registryTags = ['STEMI', 'NSTEMI', 'CAG', 'PCI', 'Angio Success', 'Angio Failure', 'Dead', 'CABG'];

export interface RegistryFilter {
  label: string;
  value: string;
  value2?: string;
  operator?: string;
  type: string; // 'tag'
}

@Component({
  selector: 'app-gtsd',
  templateUrl: './gtsd.component.html',
  styleUrls: ['./gtsd.component.scss'],
})
export class GtsdComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['hospital', 'hn', 'name', 'age', 'procedure', 'tags', 'completion'];
  dataSource = new MatTableDataSource(registries);

  device$ = this.store.select(AppStoreSelectors.device);

  private subscriptions: Subscription[] = [];
  itemsCollection$: BehaviorSubject<RegistryModel[]>;
  items$: Observable<RegistryModel[]>;
  chipFilter$: BehaviorSubject<RegistryFilter[] | null>;

  readonly separatorKeysCodes: number[] = [ENTER];
  filters: RegistryFilter[] = [];

  constructor(private store: Store<AppState>, private dialogService: DialogService) {
    this.chipFilter$ = new BehaviorSubject(null);
  }

  ngOnInit(): void {
    this.store.dispatch(AppStoreActions.setSidebarMode({ mode: null }));
    this.dataSource.filterPredicate = this.filterPredicate;

    this.subscriptions.push(
      combineLatest([this.chipFilter$]).subscribe(([filters]) => {
        this.applyFilter();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  private filterPredicate(data: RegistryModel, jsonFilter: string): boolean {
    const filters = JSON.parse(jsonFilter) as RegistryFilter[];

    for (const filter of filters) {
      let matched = true;

      switch (filter.type) {
        case 'Age':
          matched = data.age === +filter.value;
          break;
        case 'AgeOperator':
          switch (filter.operator) {
            case '<':
              matched = data.age < +filter.value;
              break;
            case '<=':
              matched = data.age <= +filter.value;
              break;
            case '>':
              matched = data.age > +filter.value;
              break;
            case '>=':
              matched = data.age >= +filter.value;
              break;
          }
          break;
        case 'AgeRange':
          matched = data.age >= +filter.value && data.age <= +filter.value2;
          break;
        case 'Date':
          matched = moment(data.procedureDateTime).format('DD/MM/YYYY') === filter.value;
          break;
        case 'DateOperator':
          const procDate = moment(data.procedureDateTime);
          const filterDate = moment(filter.value, 'DD/MM/YYYY');
          switch (filter.operator) {
            case '<':
              matched = procDate.isBefore(filterDate, 'date');
              break;
            case '<=':
              matched = procDate.isSameOrBefore(filterDate, 'date');
              break;
            case '>':
              matched = procDate.isAfter(filterDate, 'date');
              break;
            case '>=':
              matched = procDate.isSameOrAfter(filterDate, 'date');
              break;
          }
          break;
        case 'DateRange':
          const procDate2 = moment(data.procedureDateTime);
          const filDate = moment(filter.value, 'DD/MM/YYYY');
          const filDate2 = moment(filter.value2, 'DD/MM/YYYY');
          matched = procDate2.isBetween(filDate, filDate2, 'date', '[]');
          break;
        case 'Completion':
          matched = data.completion === +filter.value;
          break;
        case 'CompletionOperator':
          switch (filter.operator) {
            case '<':
              matched = data.completion < +filter.value;
              break;
            case '<=':
              matched = data.completion <= +filter.value;
              break;
            case '>':
              matched = data.completion > +filter.value;
              break;
            case '>=':
              matched = data.completion >= +filter.value;
              break;
          }
          break;
        case 'CompletionRange':
          matched = data.completion >= +filter.value && data.completion <= +filter.value2;
          break;
        case 'Tag':
          matched = data.tags.includes(filter.value);
          break;
        case 'Other':
          matched =
            data.hn.toLowerCase().includes(filter.value) ||
            data.firstName.toLowerCase().includes(filter.value) ||
            data.lastName.toLowerCase().includes(filter.value);
          break;
        default:
          break;
      }

      if (!matched) {
        return false;
      }
    }

    return true;
  }

  procedureDateClicked(dateTime: string) {
    this.addDateFilter(moment(dateTime));
  }

  tagClicked(tag: string) {
    this.addTagFilter(tag);
  }

  addFilter(regFilter: RegistryFilter, types: string[]) {
    const index = this.filters.findIndex((filter) => types.includes(filter.type));
    if (index >= 0) {
      this.filters.splice(index, 1);
    }

    this.filters.push(regFilter);
    this.chipFilter$.next(this.filters);
  }

  addAgeFilter(age: string) {
    age = age.replace(/[\syY]/g, '');

    const regFilter: RegistryFilter = {
      label: `${age} y`,
      value: age,
      type: 'Age',
    };

    this.addFilter(regFilter, ['Age', 'AgeOperator', 'AgeRange']);
  }

  addAgeOperatorFilter(age: string) {
    age = age.replace(/[\syY]/g, '');

    const result = age.match(/[<>]=?\s*/);
    const op = result[0];
    const ag = age.slice(result.index + op.length);

    const regFilter: RegistryFilter = {
      label: `${op} ${ag} y`,
      value: ag,
      operator: op,
      type: 'AgeOperator',
    };

    this.addFilter(regFilter, ['Age', 'AgeOperator', 'AgeRange']);
  }

  addAgeRangeFilter(age: string) {
    age = age.replace(/[\syY]/g, '');

    const result = age.split('-');

    if (+result[0] > +result[1]) {
      return;
    } else if (+result[0] === +result[1]) {
      this.addAgeFilter(result[0]);
      return;
    }

    const regFilter: RegistryFilter = {
      label: `${result[0]} - ${result[1]} y`,
      value: result[0],
      value2: result[1],
      type: 'AgeRange',
    };

    this.addFilter(regFilter, ['Age', 'AgeOperator', 'AgeRange']);
  }

  addDateFilter(date: moment.Moment) {
    const d = date.format('DD/MM/YYYY');
    const regFilter: RegistryFilter = {
      label: d,
      value: d,
      type: 'Date',
    };

    this.addFilter(regFilter, ['Date', 'DateOperator', 'DateRange']);
  }

  addDateOperatorFilter(date: string) {
    date = date.replace(/[\s]/g, '');

    const result = date.match(/[<>]=?\s*/);
    const op = result[0];
    const d = date.slice(result.index + op.length);

    const regFilter: RegistryFilter = {
      label: `${op} ${d}`,
      value: d,
      operator: op,
      type: 'DateOperator',
    };

    this.addFilter(regFilter, ['Date', 'DateOperator', 'DateRange']);
  }

  addDateRangeFilter(date: string) {
    date = date.replace(/[\s]/g, '');

    const result = date.split('-');
    const date1 = moment(result[0], 'DD/MM/YYYY');
    const date2 = moment(result[1], 'DD/MM/YYYY');

    if (date1.isAfter(date2, 'date')) {
      return;
    } else if (date1.isSame(date2, 'date')) {
      this.addDateFilter(date1);
      return;
    }

    const regFilter: RegistryFilter = {
      label: `${result[0]} - ${result[1]}`,
      value: result[0],
      value2: result[1],
      type: 'DateRange',
    };

    this.addFilter(regFilter, ['Date', 'DateOperator', 'DateRange']);
  }

  addCompletionFilter(completion: string) {
    completion = completion.replace(/[\s%]/g, '');

    const regFilter: RegistryFilter = {
      label: `${completion} %`,
      value: completion,
      type: 'Completion',
    };

    this.addFilter(regFilter, ['Completion', 'CompletionOperator', 'CompletionRange']);
  }

  addCompletionOperatorFilter(completion: string) {
    completion = completion.replace(/[\s%]/g, '');

    const result = completion.match(/[<>]=?\s*/);
    const op = result[0];
    const comp = completion.slice(result.index + op.length);

    const regFilter: RegistryFilter = {
      label: `${op} ${comp} %`,
      value: comp,
      operator: op,
      type: 'CompletionOperator',
    };

    this.addFilter(regFilter, ['Completion', 'CompletionOperator', 'CompletionRange']);
  }

  addCompletionRangeFilter(completion: string) {
    completion = completion.replace(/[\s%]/g, '');

    const result = completion.split('-');

    if (+result[0] > +result[1]) {
      return;
    } else if (+result[0] === +result[1]) {
      this.addCompletionFilter(result[0]);
      return;
    }

    const regFilter: RegistryFilter = {
      label: `${result[0]} - ${result[1]} %`,
      value: result[0],
      value2: result[1],
      type: 'CompletionRange',
    };

    this.addFilter(regFilter, ['Completion', 'CompletionOperator', 'CompletionRange']);
  }

  addTagFilter(tag: string) {
    const registryTag = registryTags.find((t) => t.toLowerCase() === tag.toLowerCase());
    const regFilter: RegistryFilter = {
      label: registryTag,
      value: registryTag,
      type: 'Tag',
    };

    if (this.filters.findIndex((f) => f.value === registryTag) < 0) {
      this.filters.push(regFilter);
      this.chipFilter$.next(this.filters);
    }
  }

  addOtherFilter(filter: string) {
    const regFilter: RegistryFilter = {
      label: filter,
      value: filter,
      type: 'Other',
    };

    if (this.filters.findIndex((f) => f.value === filter) < 0) {
      this.filters.push(regFilter);
      this.chipFilter$.next(this.filters);
    }
  }

  removeFilter(filter: RegistryFilter) {
    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      this.filters.splice(index, 1);
      this.chipFilter$.next(this.filters);
    }
  }

  clearFilter() {
    this.filters = [];
    this.chipFilter$.next(this.filters);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      if (agePattern.test(value)) {
        console.log('age pattern');
        this.addAgeFilter(value);
      } else if (ageOperatorPattern.test(value)) {
        console.log('age operator');
        this.addAgeOperatorFilter(value);
      } else if (ageRangePattern.test(value)) {
        console.log('age range');
        this.addAgeRangeFilter(value);
      } else if (datePattern.test(value)) {
        console.log('date pattern');
        this.addDateFilter(moment(value, 'DD/MM/YYYY'));
      } else if (dateOperatorPattern.test(value)) {
        console.log('date operator');
        this.addDateOperatorFilter(value);
      } else if (dateRangePattern.test(value)) {
        console.log('date range');
        this.addDateRangeFilter(value);
      } else if (completionPattern.test(value)) {
        console.log('completion pattern');
        this.addCompletionFilter(value);
      } else if (completionOperatorPattern.test(value)) {
        console.log('completion operator');
        this.addCompletionOperatorFilter(value);
      } else if (completionRangePattern.test(value)) {
        console.log('completion range');
        this.addCompletionRangeFilter(value);
      } else if (registryTags.map((t) => t.toLowerCase()).includes(value.toLowerCase())) {
        this.addTagFilter(value);
      } else {
        this.addOtherFilter(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(filter: RegistryFilter): void {
    this.removeFilter(filter);
  }

  openInfo() {
    this.dialogService.createModalDialog({
      title: null,
      content: `<h2 id="smart-filters">Smart Filters</h2>
      <table>
      <thead>
      <tr>
      <th>Type</th>
      <th>Color</th>
      <th>Field</th>
      <th>Example</th>
      </tr>
      </thead>
      <tbody><tr>
      <td>Numeric</td>
      <td style="background-color: #bcf1dd;">Green</td>
      <td>Age, Procedure Date, Completion</td>
      <td>45 y, 1/1/2020 - 15/3/2020, &lt;= 100 %</td>
      </tr>
      <tr>
      <td>Tag</td>
      <td style="background-color: #c8f7ff;">Blue</td>
      <td>Tag</td>
      <td>STEMI, CAG, PCI, CABG</td>
      </tr>
      <tr>
      <td>String</td>
      <td style="background-color: #e0e0e0;">Gray</td>
      <td>HN, AN, Name</td>
      <td>0234234234, David</td>
      </tr>
      </tbody></table>`,
      buttons: ['Close'],
    });
  }
}
