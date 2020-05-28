import { Component, OnInit, Inject, OnDestroy, AfterViewInit, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product, ProductOrder, SubProduct } from '../cath-lab-quotation.model';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RegSelectChoice } from 'src/app/shared/modules/registry-form/registry-form.model';

import { startWith, pairwise } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/root-store.state';
import { ClqStoreSelectors } from 'src/app/store/cath-lab-quotation';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  controlService = null;
  productForm: FormGroup;
  addMode = false;
  products: Product[];
  subProducts: RegSelectChoice[][] = [];
  enableSubProducts: boolean;
  private subscriptions: Subscription[] = [];
  product: Product;
  canAddSubProduct = true;
  isPreset = false;

  constructor(
    private dialogRef: MatDialogRef<ProductComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Product,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    if (!data) {
      this.addMode = true;
      this.product = {} as Product;
    } else {
      this.product = data;
    }
    this.createProductForm(data);

    this.subscriptions.push(
      this.store.select(ClqStoreSelectors.products).subscribe((products) => {
        this.products = products;
      })
    );
  }

  ngOnInit(): void {}

  ngAfterContentInit() {
    this.loadProductForm(this.product);
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createProductForm(data: Product) {
    this.productForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      description: [null],
      brand: [null, Validators.required],
      category: [null, Validators.required],
      subProducts: this.fb.array([]),
      sumThaiPrice: [null],
      sumInterPrice: [null],
      thaiPrice: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      interPrice: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      status: [null, Validators.required],
      note: [null],
      updatedDateTime: [null],
    });

    this.subscriptions.push(
      this.productForm
        .get('category')
        // tslint:disable-next-line: deprecation
        .valueChanges.pipe(startWith(null), pairwise())
        .subscribe(([prev, next]) => {
          const subProducts = this.productForm.get('subProducts') as FormArray;

          // if (!(['# Pre-set #', '# Bundle #'].includes(prev) && ['# Pre-set #', '# Bundle #'].includes(next))) {
          //   subProducts.clear();
          // }
          this.enableSubProducts = false;

          if (next === '# Pre-set #' || next === '# Bundle #') {
            this.enableSubProducts = true;
            this.isPreset = next === '# Pre-set #';

            if (!(prev === '# Pre-set #' || prev === '# Bundle #')) {
              subProducts.clear();
              this.addSubProducts();
            }
          } else {
            subProducts.clear();
          }
        })
    );
  }

  private createSubProductSubForm() {
    const subProductFormGroup = this.fb.group({
      product: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(/^(?:[1-9]|10)$/)]],
      thaiPrice: [null, Validators.required],
      interPrice: [null, Validators.required],
    });

    this.subscriptions.push(
      subProductFormGroup.get('product').valueChanges.subscribe((value) => {
        this.canAddSubProduct = true;
        this.generateProductList();
      }),
      subProductFormGroup.valueChanges.subscribe((value: ProductOrder) => {
        let thaiPrice = null;
        let interPrice = null;

        if (subProductFormGroup.get('product').valid && subProductFormGroup.get('quantity').valid) {
          thaiPrice = (value.product.thaiPrice * value.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 });
          interPrice = (value.product.interPrice * value.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 });
        }
        subProductFormGroup.get('thaiPrice').setValue(thaiPrice, { emitEvent: false });
        subProductFormGroup.get('interPrice').setValue(interPrice, { emitEvent: false });

        this.calculateSumPrice();
      })
    );

    return subProductFormGroup;
  }

  private loadProductForm(data: Product) {
    console.log(data);
    this.productForm.patchValue(data);

    if (data.subProducts?.length > 0) {
      this.removeSubProduct(0);
      data.subProducts.forEach((subProduct) => {
        this.addSubProducts(subProduct);
      });
    }
  }

  addSubProducts(subProduct?: SubProduct) {
    const subProducts = this.productForm.get('subProducts') as FormArray;
    const subProductForm = this.createSubProductSubForm();

    subProducts.push(subProductForm);
    this.canAddSubProduct = false;

    if (subProduct) {
      const product = this.products.find((p) => p.id === subProduct.productId);
      const quantity = subProduct.quantity;

      subProductForm.get('product').setValue(product);
      subProductForm.get('quantity').setValue(quantity);
      this.canAddSubProduct = true;
    }

    this.generateProductList();
  }

  removeSubProduct(index: number) {
    const subProducts = this.productForm.get('subProducts') as FormArray;

    if (!subProducts.controls[index].get('product').value) {
      this.canAddSubProduct = true;
    }

    subProducts.removeAt(index);

    this.generateProductList();
  }

  private generateProductList() {
    const subProducts = this.productForm.get('subProducts') as FormArray;

    this.subProducts = [];
    const selectedProducts: Product[] = [];

    subProducts.controls.forEach((control: FormGroup) => {
      const product = control.controls[`product`].value;
      selectedProducts.push(product);
    });

    subProducts.controls.forEach((control: FormGroup) => {
      const selectedProduct = control.controls[`product`].value;

      const productChoice = this.products
        .filter((product) => !['# Pre-set #', '# Bundle #'].includes(product.category))
        .map((product) => {
          return {
            value: product,
            label: product.name + ' - ' + product.brand,
            group: product.category,
            disable: product !== selectedProduct && selectedProducts.includes(product),
          } as RegSelectChoice;
        });

      this.subProducts.push(productChoice);
    });
  }

  private calculateSumPrice() {
    let sumThaiPrice = 0;
    let sumInterPrice = 0;
    const subProducts = this.productForm.get('subProducts') as FormArray;

    subProducts.controls.forEach((control: FormGroup) => {
      const productControl = control.controls[`product`] as FormControl;
      const quantityControl = control.controls[`quantity`] as FormControl;

      if (productControl.valid && quantityControl.valid) {
        const product = productControl.value as Product;
        const quantity = quantityControl.value;

        sumThaiPrice += product.thaiPrice * quantity;
        sumInterPrice += product.interPrice * quantity;
      }
    });

    this.productForm.get('sumThaiPrice').setValue(sumThaiPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }));
    this.productForm.get('sumInterPrice').setValue(sumInterPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }));

    if (this.isPreset) {
      this.productForm.get('thaiPrice').setValue(sumThaiPrice);
      this.productForm.get('interPrice').setValue(sumInterPrice);
    }
  }

  submit() {
    const value = this.productForm.value;
    const product: Product = {
      id: value.id,
      name: value.name ? value.name.trim() : null,
      description: value.description ? value.description.trim() : null,
      brand: value.brand,
      category: value.category,
      subProducts: this.getSubProducts(),
      thaiPrice: value.thaiPrice,
      interPrice: value.interPrice,
      status: value.status,
      note: value.note ? value.note.trim() : null,
      createdAt: this.product.createdAt,
      updatedAt: this.product.updatedAt,
    };
    this.dialogRef.close(product);
  }

  private getSubProducts() {
    const subProductFormArray = this.productForm.get('subProducts') as FormArray;

    const subProducts = subProductFormArray.controls.map((control: FormGroup) => {
      const product = control.controls[`product`].value as Product;
      const quan = control.controls[`quantity`].value;
      return {
        productId: product.id,
        quantity: quan,
      };
    });

    return subProducts;
  }
}
