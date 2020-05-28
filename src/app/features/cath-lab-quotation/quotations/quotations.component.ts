import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import * as mock from '../cath-lab-quotation.mock';
import { Quotation } from '../cath-lab-quotation.model';
import { CathLabQuotationService } from '../cath-lab-quotation.service';
import { Subscription } from 'rxjs';
import { ClqStoreSelectors } from 'src/app/store/cath-lab-quotation';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/root-store.state';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss'],
})
export class QuotationsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  quotations: Quotation[];
  displayedColumns: string[] = ['hn', 'patient', 'age', 'procedure', 'procedureDateTime', 'physician', 'offerDateTime'];
  dataSource: MatTableDataSource<Quotation>;

  constructor(private router: Router, private store: Store<AppState>, private quotationService: CathLabQuotationService) {
    this.subscriptions.push(
      this.store.select(ClqStoreSelectors.quotations).subscribe((quotations) => {
        this.quotations = quotations;
        this.dataSource = new MatTableDataSource(this.quotations);
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  quotationClicked(quatation: Quotation) {
    this.router.navigate(['cath-lab-quotation/quotation', quatation.id]);
  }

  addClicked() {
    this.router.navigate(['cath-lab-quotation/quotation']);
  }
}
