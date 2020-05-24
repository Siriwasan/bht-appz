import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../cath-lab-quotation.model';

@Component({
  selector: 'app-bundles-dialog',
  templateUrl: './bundles-dialog.component.html',
  styleUrls: ['./bundles-dialog.component.scss'],
})
export class BundlesDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<BundlesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any[]) {}

  ngOnInit(): void {}

  selectClicked(bundle: any) {
    this.dialogRef.close(bundle as Product);
  }
}
