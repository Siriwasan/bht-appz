import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Quotation, ProductOrder, Product } from '../cath-lab-quotation.model';

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
  private quotation = { priceVariation: 10 } as Quotation;

  products: RegSelectChoice[][] = [];

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.createQuatationForm();
    this.addUseProducts();

    this.subscriptions.push(this.quotationForm.get('priceVariation').valueChanges.subscribe((value) => this.calculateEstimatedPrice()));
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

  private createQuatationForm() {
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
      useProducts: this.fb.array([]),
      backupProducts: [this.quotation.backupProducts],
      usePrice: [this.quotation.usePrice, Validators.required],
      priceVariation: [this.quotation.priceVariation, Validators.required],
      estimatedPrice: [this.quotation.usePrice, Validators.required],
      note: [this.quotation.note],
      quotedBy: [this.quotation.quotedBy, Validators.required],
      quotedDateTime: [this.quotation.quotedDateTime, Validators.required],
    });
  }

  private createProductSubForm() {
    const productFormGroup = this.fb.group({
      product: [null, Validators.required],
      unitPrice: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(/^(?:[1-9]|10)$/)]],
      price: [null, Validators.required],
    });

    this.subscriptions.push(
      productFormGroup.get('product').valueChanges.subscribe((value) => {
        this.canAddUseProduct = true;
        this.generateProductList();
      }),
      productFormGroup.valueChanges.subscribe((value: ProductOrder) => {
        if (value.product) {
          const unitPrice = value.product.thaiPrice;
          const quantity = value.quantity;
          let price = '';

          productFormGroup
            .get('unitPrice')
            .setValue(unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }), { emitEvent: false });

          if (productFormGroup.get('quantity').valid && value.quantity) {
            price = (unitPrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 });
          }

          productFormGroup.get('price').setValue(price, { emitEvent: false });
        }

        this.calculateUsePrice();
      })
    );

    return productFormGroup;
  }

  private calculateUsePrice() {
    let usePrice = 0;
    const useProducts = this.quotationForm.get('useProducts') as FormArray;

    useProducts.controls.forEach((control: FormControl) => {
      const product = control[`controls`][`product`];
      const unitPrice = product.value ? product.value[`thaiPrice`] : 0;
      const quantity = control[`controls`][`quantity`]?.value ?? 0;

      if (control[`controls`][`quantity`].valid) {
        usePrice += unitPrice * quantity;
      }
    });

    this.quotationForm.get('usePrice').setValue(usePrice.toLocaleString(undefined, { minimumFractionDigits: 2 }));

    this.calculateEstimatedPrice();
  }

  private calculateEstimatedPrice() {
    const usePrice = this.quotationForm.get('usePrice').value as string;
    const priceVariation = +(this.quotationForm.get('priceVariation') as FormControl).value;
    const estimatedPriceLower = +usePrice.replace(',', '');
    const estimatedPriceUpper = (+usePrice.replace(',', '') * (100 + priceVariation)) / 100;
    const estimatedPrice = `${estimatedPriceLower.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })} - ${estimatedPriceUpper.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    this.quotationForm.get('estimatedPrice').setValue(estimatedPrice);
  }

  addUseProducts() {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;
    useProducts.push(this.createProductSubForm());
    this.canAddUseProduct = false;

    this.calculateUsePrice();
    this.generateProductList();
  }

  removeUseProduct(index: number) {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;

    if (!useProducts.controls[index].get('product').value) {
      this.canAddUseProduct = true;
    }

    useProducts.removeAt(index);

    this.calculateUsePrice();
    this.generateProductList();
  }

  private generateProductList() {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;

    this.products = [];
    const selectedProducts: Product[] = [];

    useProducts.controls.forEach((control: FormGroup) => {
      const product = control.controls[`product`].value;
      selectedProducts.push(product);
    });

    useProducts.controls.forEach((control: FormGroup) => {
      const selectedProduct = control.controls[`product`].value;

      const productChoice = mock.products.map((product) => {
        return {
          value: product,
          label: product.name + ' - ' + product.brand,
          group: product.category,
          disable: product !== selectedProduct && selectedProducts.includes(product),
        } as RegSelectChoice;
      });

      this.products.push(productChoice);
    });
  }
}
