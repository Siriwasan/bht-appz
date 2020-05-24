import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Quotation, ProductOrder, Product, SubProduct } from '../cath-lab-quotation.model';

import * as mock from '../cath-lab-quotation.mock';
import { RegSelectChoice } from 'src/app/shared/modules/registry-form/registry-form.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BundlesDialogComponent } from './bundles-dialog/bundles-dialog.component';

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

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dialog: MatDialog) {
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
      productFormGroup.get('product').valueChanges.subscribe((value: Product) => {
        console.log('product changed');
        this.canAddUseProduct = true;
        if (value.category === '# Pre-set #') {
          this.addByPreSet(value);
        }
        this.generateProductList();
      }),
      productFormGroup.valueChanges.subscribe((value: ProductOrder) => {
        // console.log(value);
        this.checkBundleProduct();
        this.calculateUsePrice();
      })
    );

    return productFormGroup;
  }

  private calculateUsePrice() {
    let sumUsePrice = 0;
    const useProducts = this.quotationForm.get('useProducts') as FormArray;

    useProducts.controls.forEach((control: FormGroup) => {
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

    this.quotationForm.get('usePrice').setValue(sumUsePrice.toLocaleString(undefined, { minimumFractionDigits: 2 }), { emitEvent: false });

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

  addUseProducts(subProduct?: SubProduct) {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;
    const useProductForm = this.createProductSubForm();

    if (subProduct) {
      const product = mock.products.find((p) => p.id === subProduct.productId);
      const quantity = subProduct.quantity;
      let isDuplicated = false;

      for (let index = 0; index < useProducts.controls.length; index++) {
        const element = useProducts.controls[index];

        if (useProducts.value[index].product === product) {
          const newQuantity = +useProducts.value[index].quantity + quantity;
          element.get('quantity').setValue(newQuantity, { emitEvent: false });
          isDuplicated = true;
        }
      }

      if (!isDuplicated) {
        useProductForm.get('product').setValue(product, { emitEvent: false });
        useProductForm.get('quantity').setValue(quantity, { emitEvent: false });
        useProducts.push(useProductForm);
        this.canAddUseProduct = true;
      }
    } else {
      useProducts.push(useProductForm);
      this.canAddUseProduct = false;
    }

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
    this.checkBundleProduct();
  }

  private addByPreSet(preSet: Product) {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;

    this.removeUseProduct(useProducts.controls.length - 1);

    preSet.subProducts.forEach((subProduct) => {
      this.addUseProducts(subProduct);
    });
  }

  private checkBundleProduct() {
    console.log('check bundle product');

    const useProductsControl = this.quotationForm.get('useProducts') as FormArray;
    const useProducts = useProductsControl.getRawValue().map((el) => {
      return { product: el.product, quantity: +el.quantity };
    });
    console.log(useProducts);

    const bundles = mock.products.filter((product) => product.category === '# Bundle #');
    console.log(bundles);

    const matchedBundles = [];

    bundles.forEach((bundle) => {
      let matched = true;
      bundle.subProducts.forEach((subProduct) => {
        let found = false;

        useProducts.forEach((useProduct) => {
          if (useProduct.product && subProduct.productId === useProduct.product.id && subProduct.quantity <= useProduct.quantity) {
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

    console.log(matchedBundles.length > 0 ? 'matched' : 'not matched', matchedBundles);
    if (matchedBundles.length > 0) {
      this.askForBundles(matchedBundles);
    }
  }

  private askForBundles(bundles: Product[]) {
    const mappedBundles = bundles.map((bundle) => {
      return {
        ...bundle,
        subProducts: bundle.subProducts.map((sub) => {
          return {
            ...sub,
            product: mock.products.find((p) => p.id === sub.productId),
          };
        }),
      };
    });

    this.dialog
      .open(BundlesDialogComponent, {
        width: 'auto',
        disableClose: true,
        autoFocus: true,
        data: mappedBundles,
      })
      .afterClosed()
      .subscribe((result: Product) => {
        if (result) {
          // this.products.push(result);
          // this.groupingProducts();
          // this.flattenGroupedProducts();
        }
      });
  }

  private generateProductList() {
    const useProducts = this.quotationForm.get('useProducts') as FormArray;

    this.products = [];
    const selectedProducts: Product[] = [];

    useProducts.controls.forEach((control: FormGroup) => {
      const product = control.get('product').value;
      selectedProducts.push(product);
    });

    useProducts.controls.forEach((control: FormGroup) => {
      const selectedProduct = control.get('product').value;

      const productChoice = mock.products
        .filter((product) => {
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

      this.products.push(productChoice);
    });
  }
}
