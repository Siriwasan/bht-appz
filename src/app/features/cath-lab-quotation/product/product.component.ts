import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../cath-lab-quotation.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  controlService = null;
  productForm: FormGroup;
  addMode = false;

  constructor(private dialogRef: MatDialogRef<ProductComponent>, @Inject(MAT_DIALOG_DATA) private data: Product, private fb: FormBuilder) {
    if (!data) {
      this.addMode = true;
      data = { name: '(new)' } as Product;
    }

    this.productForm = this.fb.group({
      id: [data.id],
      name: [data.name, Validators.required],
      description: [data.description],
      brand: [data.brand, Validators.required],
      category: [data.category, Validators.required],
      thaiPrice: [data.thaiPrice, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      interPrice: [data.interPrice, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      status: [data.status, Validators.required],
      note: [data.note],
      updatedDateTime: [data.updatedDateTime],
    });
  }

  ngOnInit(): void {}

  submit() {
    const value = this.productForm.value;
    const product: Product = {
      id: value.id,
      name: value.name ? value.name.trim() : null,
      description: value.description ? value.description.trim() : null,
      brand: value.brand,
      category: value.category,
      thaiPrice: value.thaiPrice,
      interPrice: value.interPrice,
      status: value.status,
      note: value.note ? value.note.trim() : null,
      updatedDateTime: new Date().toISOString(),
    };
    this.dialogRef.close(product);
  }
}
