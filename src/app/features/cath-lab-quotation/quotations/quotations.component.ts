import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import * as mock from '../cath-lab-quotation.mock';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss'],
})
export class QuotationsComponent implements OnInit {
  quotations = mock.quotations;
  displayedColumns: string[] = ['hn', 'patient', 'age', 'procedure', 'procedureDateTime', 'physician', 'offerDateTime'];
  dataSource = new MatTableDataSource(this.quotations);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor() {}

  ngOnInit(): void {}

  quotationClicked() {
    console.log('quotation click!!');
  }
}
