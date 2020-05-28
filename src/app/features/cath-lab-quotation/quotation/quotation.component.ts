import { Component, OnInit, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Quotation, ProductOrder, Product, SubProduct } from '../cath-lab-quotation.model';

import { RegSelectChoice } from 'src/app/shared/modules/registry-form/registry-form.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BundlesDialogComponent } from './bundles-dialog/bundles-dialog.component';
import { CathLabQuotationService } from '../cath-lab-quotation.service';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/root-store.state';
import { ClqStoreSelectors } from 'src/app/store/cath-lab-quotation';
import { quotations } from 'src/app/store/cath-lab-quotation/cath-lab-quotation.selector';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  controlService = null;
  private subscriptions: Subscription[] = [];

  products: Product[];
  quotationForm: FormGroup;
  quotationId: string;
  canAddProductSubform = { useProducts: true, backupProducts: true };
  private quotation: Quotation;
  addMode = false;

  productList = { useProducts: [], backupProducts: [] };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private quotationService: CathLabQuotationService,
    private store: Store<AppState>
  ) {
    this.createQuatationForm();
    this.addProductSubform('useProducts');
    // this.addProductSubform('backupProducts');
  }

  ngOnInit(): void {
    if (this.route.snapshot.params.hasOwnProperty('id')) {
      this.quotationId = this.route.snapshot.paramMap.get('id');
      this.store.select(ClqStoreSelectors.quotation(this.quotationId)).subscribe((quotation) => {
        this.quotation = quotation;
        this.loadQuotationForm(this.quotation);
      });
    } else {
      this.addMode = true;
      this.quotation = { priceVariation: 10 } as Quotation;
    }
  }

  ngAfterContentInit() {
    this.subscriptions.push(
      this.store.select(ClqStoreSelectors.products).subscribe((products) => {
        this.products = products;
        this.generateProductList('useProducts');
      })
    );
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createQuatationForm() {
    this.quotationForm = this.fb.group({
      id: [null],
      hn: [null, [Validators.required, Validators.pattern(/^01\d{8}$/)]],
      an: [null, [Validators.required, Validators.pattern(/^I01\d{9}$/)]],
      patient: [null, Validators.required],
      birthdate: [null, Validators.required],
      age: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      payment: [null, Validators.required],
      procedure: [null, Validators.required],
      physician: [null, Validators.required],
      procedureDateTime: [null, Validators.required],
      useProducts: this.fb.array([]),
      backupProducts: this.fb.array([]),
      usePrice: [null, Validators.required],
      backupPrice: [null],
      priceVariation: [null, Validators.required],
      estimatedPrice: [null, Validators.required],
      note: [null],
      quotedBy: [null, Validators.required],
      createdAt: [null],
      updatedAt: [null],
    });

    this.subscriptions.push(
      this.quotationForm.get('birthdate').valueChanges.subscribe((value) => this.calculateAge(value)),
      this.quotationForm.get('priceVariation').valueChanges.subscribe((value) => this.calculateEstimatedPrice())
    );
  }

  private createProductSubform(formArray: string) {
    const productSubform = this.fb.group({
      product: [null, Validators.required],
      unitPrice: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(/^(?:[1-9]|10)$/)]],
      price: [null, Validators.required],
    });

    this.subscriptions.push(
      productSubform.get('product').valueChanges.subscribe((value: Product) => {
        this.canAddProductSubform[formArray] = true;
        if (value.category === '# Pre-set #') {
          this.addByPreSet(formArray, value);
        }
        this.generateProductList(formArray);
      }),
      productSubform.valueChanges.subscribe((value: ProductOrder) => {
        this.checkBundleProduct(formArray);
        this.calculateProductFormArrayPrice(formArray);
      })
    );

    return productSubform;
  }

  private loadQuotationForm(data: Quotation) {
    console.log(data);
    if (data) {
      this.quotationForm.patchValue({
        ...data,
        birthdate: moment(data.birthdate.toDate()),
        procedureDateTime: moment(data.procedureDateTime.toDate()),
        createdAt: moment(data.createdAt?.toDate()).format('DD/MM/YYYY H:mm'),
        updatedAt: moment(data.updatedAt?.toDate()).format('DD/MM/YYYY H:mm'),
      });
    }

    // if (data.useProducts?.length > 0) {
    //   this.removeProductSubform('useProducts', 0);
    //   data.useProducts.forEach((useProduct) => {
    //     this.addProductSubform('useProducts', useProduct);
    //   });
    // }
  }

  private calculateAge(birthdate: string) {
    const dob = moment(birthdate);
    if (!dob.isValid()) {
      this.quotationForm.get('age').reset();
      return;
    }

    const age = -dob.diff(new Date(), 'years', false);
    this.quotationForm.get('age').setValue(age);
    this.quotationForm.get('age').markAsTouched();
  }

  private calculateProductFormArrayPrice(formArray: string) {
    let sumUsePrice = 0;
    const productFormArray = this.quotationForm.get(formArray) as FormArray;

    productFormArray.controls.forEach((control: FormGroup) => {
      const productControl = control.get('product');
      const quantityControl = control.get('quantity');
      let unitPrice = null;
      let price = null;

      if (productControl.valid) {
        unitPrice = productControl.value[`thaiPrice`];

        if (quantityControl.valid) {
          price = unitPrice * +quantityControl.value;

          sumUsePrice += price;
        }
      }
      control.get('unitPrice').setValue(unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }), { emitEvent: false });
      control.get('price').setValue(price?.toLocaleString(undefined, { minimumFractionDigits: 2 }), { emitEvent: false });
    });

    if (formArray === 'useProducts') {
      this.quotationForm
        .get('usePrice')
        .setValue(sumUsePrice.toLocaleString(undefined, { minimumFractionDigits: 2 }), { emitEvent: false });

      this.calculateEstimatedPrice();
    } else {
      this.quotationForm
        .get('backupPrice')
        .setValue(sumUsePrice.toLocaleString(undefined, { minimumFractionDigits: 2 }), { emitEvent: false });
    }
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

  addProductSubform(formArray: string, subProduct?: SubProduct) {
    const productFormArray = this.quotationForm.get(formArray) as FormArray;
    const productSubform = this.createProductSubform(formArray);

    if (subProduct) {
      const product = this.products.find((p) => p.id === subProduct.productId);
      const quantity = subProduct.quantity;
      let isDuplicated = false;

      for (let index = 0; index < productFormArray.controls.length; index++) {
        const element = productFormArray.controls[index];

        if (productFormArray.value[index].product === product) {
          const newQuantity = +productFormArray.value[index].quantity + quantity;
          element.get('quantity').setValue(newQuantity, { emitEvent: false });
          isDuplicated = true;
        }
      }

      if (!isDuplicated) {
        productSubform.get('product').setValue(product, { emitEvent: false });
        productSubform.get('quantity').setValue(quantity, { emitEvent: false });
        productFormArray.push(productSubform);
        this.canAddProductSubform[formArray] = true;
      }
    } else {
      productFormArray.push(productSubform);
      this.canAddProductSubform[formArray] = false;
    }

    this.calculateProductFormArrayPrice(formArray);
    this.generateProductList(formArray);
  }

  removeProductSubform(formArray: string, index: number) {
    const productFormArray = this.quotationForm.get(formArray) as FormArray;

    if (!productFormArray.controls[index].get('product').value) {
      this.canAddProductSubform[formArray] = true;
    }

    productFormArray.removeAt(index);

    this.calculateProductFormArrayPrice(formArray);
    this.generateProductList(formArray);
    this.checkBundleProduct(formArray);
  }

  private addByPreSet(formArray: string, preSet: Product) {
    const productFormArray = this.quotationForm.get(formArray) as FormArray;

    this.removeProductSubform(formArray, productFormArray.controls.length - 1);

    preSet.subProducts.forEach((subProduct) => {
      this.addProductSubform(formArray, subProduct);
    });
  }

  private async checkBundleProduct(formArray: string) {
    const productFormArray = this.quotationForm.get(formArray) as FormArray;
    const selectedProducts = productFormArray.controls.map((control) => {
      return {
        product: control.get('product').value,
        productValid: control.get('product').valid,
        quantity: +control.get('quantity').value,
        quantitytValid: control.get('quantity').valid,
      };
    });

    const bundles = this.products.filter((product) => product.category === '# Bundle #');
    const matchedBundles = [];

    bundles.forEach((bundle) => {
      let matched = true;
      bundle.subProducts.forEach((subProduct) => {
        let found = false;

        selectedProducts.forEach((useProduct) => {
          if (
            useProduct.productValid &&
            useProduct.quantitytValid &&
            subProduct.productId === useProduct.product.id &&
            subProduct.quantity <= useProduct.quantity
          ) {
            found = true;
          }
        });

        if (!found) {
          matched = false;
          return;
        }
      });
      if (matched) {
        matchedBundles.push(bundle);
      }
    });

    if (matchedBundles.length > 0) {
      const selectedBundle = await this.askForBundles(matchedBundles);
      if (selectedBundle) {
        this.replaceWithBundle(formArray, selectedBundle);
      }
    }
  }

  private askForBundles(bundles: Product[]) {
    const mappedBundles = bundles.map((bundle) => {
      return {
        ...bundle,
        subProducts: bundle.subProducts.map((sub) => {
          return {
            ...sub,
            product: this.products.find((p) => p.id === sub.productId),
          };
        }),
      };
    });

    return this.dialog
      .open(BundlesDialogComponent, {
        width: 'auto',
        disableClose: true,
        autoFocus: true,
        data: mappedBundles,
      })
      .afterClosed()
      .toPromise<Product>();
  }

  private replaceWithBundle(formArray: string, bundle: Product) {
    const productFormArray = this.quotationForm.get(formArray) as FormArray;
    bundle.subProducts.forEach((subProduct) => {
      for (let index = 0; index < productFormArray.controls.length; index++) {
        const control = productFormArray.controls[index];

        const product = control.get('product').value as Product;
        if (product && product.id === subProduct.productId) {
          let quantity = +control.get('quantity').value;
          quantity -= subProduct.quantity;
          if (quantity > 0) {
            control.get('quantity').setValue(quantity);
          } else {
            productFormArray.removeAt(index);
          }
        }
      }
    });

    if (productFormArray.controls.length > 0 && productFormArray.controls[productFormArray.controls.length - 1].value.product === null) {
      productFormArray.removeAt(productFormArray.controls.length - 1);
    }
    this.addProductSubform(formArray, { productId: bundle.id, quantity: 1 });
  }

  private generateProductList(formArray: string) {
    const productFormArray = this.quotationForm.get(formArray) as FormArray;

    this.productList[formArray] = [];
    const selectedProducts: Product[] = [];

    productFormArray.controls.forEach((control: FormGroup) => {
      const product = control.get('product').value;
      selectedProducts.push(product);
    });

    productFormArray.controls.forEach((control: FormGroup) => {
      const selectedProduct = control.get('product').value;

      const productChoice = this.products
        ?.filter((product) => {
          if (!selectedProduct) {
            return true;
          } else if (product.category === '# Pre-set #') {
            return false;
          } else if (product.category === '# Bundle #' && product !== selectedProduct) {
            return false;
          }
          return true;
        })
        .map((product) => {
          return {
            value: product,
            label: product.name + ' - ' + product.brand,
            group: product.category,
            disable: product !== selectedProduct && selectedProducts.includes(product),
          } as RegSelectChoice;
        });

      this.productList[formArray].push(productChoice);
    });
  }

  submit() {
    const value = this.quotationForm.getRawValue();
    const quotation: Quotation = {
      id: value.id,
      hn: value.hn ? value.hn.trim() : null,
      an: value.an ? value.an.trim() : null,
      patient: value.patient ? value.patient.trim() : null,
      birthdate: firebase.firestore.Timestamp.fromDate(moment(value.birthdate).toDate()),
      age: value.age,
      payment: value.payment,
      physician: value.physician,
      procedure: value.procedure,
      procedureDateTime: firebase.firestore.Timestamp.fromDate(moment(value.procedureDateTime).toDate()),
      useProducts: this.getUseProducts(),
      usePrice: value.usePrice,
      backupProducts: this.getBackupProducts(),
      backupPrice: value.backupPrice,
      priceVariation: +value.priceVariation,
      estimatedPrice: value.estimatedPrice,
      note: value.note,
      quotedBy: value.quotedBy ? value.quotedBy.trim() : null,
      createdAt: this.quotation.createdAt,
      updatedAt: this.quotation.updatedAt,
    };

    if (this.addMode) {
      this.quotationService.addQuotation(quotation);
    } else {
      this.quotationService.updateQuotation(quotation);
    }
  }

  getUseProducts() {
    return [];
  }

  getBackupProducts() {
    return [];
  }
}
