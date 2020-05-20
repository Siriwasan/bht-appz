import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import * as mock from './cath-lab-quotation.mock';

@Component({
  selector: 'app-cath-lab-quotation',
  templateUrl: './cath-lab-quotation.component.html',
  styleUrls: ['./cath-lab-quotation.component.scss'],
})
export class CathLabQuotationComponent implements OnInit {
  quotations = mock.quotations;
  displayedColumns: string[] = ['hn', 'patient', 'age', 'procedure', 'procedureDateTime', 'physician', 'offerDateTime'];
  dataSource = new MatTableDataSource(this.quotations);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor() {}

  ngOnInit(): void {}
}
