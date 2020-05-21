import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Quotation, ProductOrder } from '../cath-lab-quotation.model';

import * as mock from '../cath-lab-quotation.mock';
import { RegSelectChoice } from 'src/app/shared/modules/registry-form/registry-form.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit, AfterViewInit, OnDestroy {
  controlService = null;
  private subscriptions: Subscription[] = [];

  quotationForm: FormGroup;
  quotationId: string;
  canAddUseProduct: boolean;
  private quotation = {} as Quotation;

  products: RegSelectChoice[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.quotationForm = this.fb.group({
      id: [this.quotation.id, Validators.required],
      hn: [this.quotation.hn, [Validators.required, Validators.pattern(/^01\d{8}$/)]],
      an: [this.quotation.an, [Validators.required, Validators.pattern(/^01\d{9}$/)]],
      patient: [this.quotation.patient, Validators.required],
      birthdate: [this.quotation.birthdate, Validators.required],
      age: [this.quotation.age, [Validators.required, Validators.min(0), Validators.max(100)]],
      payment: [this.quotation.payment, Validators.required],
      procedure: [this.quotation.procedure, Validators.required],
      physician: [this.quotation.physician, Validators.required],
      procedureDateTime: [this.quotation.procedureDateTime, Validators.required],
      useProducts: this.fb.array([this.createProductArray()]),
      backupProducts: [this.quotation.backupProducts],
      totalPrice: [this.quotation.totalPrice, Validators.required],
      note: [this.quotation.note],
      quotedBy: [this.quotation.quotedBy, Validators.required],
      quotedDateTime: [this.quotation.quotedDateTime, Validators.required],
    });

    this.products = mock.products.map((product) => {
      return {
        value: product,
        label: product.name + ' - ' + product.brand,
        group: product.category,
        disable: false,
      } as RegSelectChoice;
    });
  }

  getProducts(fg: FormGroup) {
    const selectedProduct = fg[`controls`][`product`].value;
    console.log(selectedProduct);
    const result: RegSelectChoice[] = [];

    // this.products.forEach((p) => {
    //   result.push(p);
    // });

    result.push({
      value: mock.products[0],
      label: mock.products[0].name + ' - ' + mock.products[0].brand,
      group: mock.products[0].category,
      disable: false,
    });

    return result;
  }

  ngOnInit(): void {
    if (this.route.snapshot.params.hasOwnProperty('id')) {
      this.quotationId = this.route.snapshot.paramMap.get('id');
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createProductArray() {
    const productFormGroup = this.fb.group({
      product: [null, Validators.required],
      unitPrice: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(/^(?:[0-9]|10)$/)]],
      price: [null, Validators.required],
    });

    this.subscriptions.push(
      productFormGroup.valueChanges.subscribe((value: ProductOrder) => {
        if (value.product) {
          const unitPrice = value.product.thaiPrice;
          const quantity = value.quantity;
          let price = '';

          productFormGroup
            .get('unitPrice')
            .setValue(unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }), { onlySelf: true, emitEvent: false });

          if (productFormGroup.get('quantity').valid && value.quantity) {
            price = (unitPrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 });
          }

          productFormGroup.get('price').setValue(price, { onlySelf: true, emitEvent: false });
        }

        this.calculateTotalPrice();
      })
    );

    return productFormGroup;
  }

  calculateTotalPrice() {
    let totalPrice = 0;
    let stillHasNullProduct = false;
    const useProducts = this.quotationForm.get('useProducts') as FormArray;

    useProducts.controls.forEach((control: FormControl) => {
      const product = control[`controls`][`product`];
      const unitPrice = product.value ? product.value[`thaiPrice`] : 0;
      const quantity = control[`controls`][`quantity`]?.value ?? 0;

      if (control[`controls`][`quantity`].valid) {
        totalPrice += unitPrice * quantity;
      }

      stillHasNullProduct = !product.value;
    });

    this.quotationForm.get('totalPrice').setValue(totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }));

    this.canAddUseProduct = !stillHasNullProduct;
  }

  addUseProducts() {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;
    useProducts.push(this.createProductArray());
    this.canAddUseProduct = false;
  }

  removeUseProduct(index: number) {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;
    useProducts.removeAt(index);
    this.calculateTotalPrice();
  }
}
