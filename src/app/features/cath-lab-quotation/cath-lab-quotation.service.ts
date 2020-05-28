import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Product, Quotation } from './cath-lab-quotation.model';
import { AppState } from 'src/app/store/root-store.state';
import { ClqStoreActions } from 'src/app/store/cath-lab-quotation';
import { Subscription } from 'rxjs';

export const DB_PRODUCT = 'clq-Product';
export const DB_QUOTATION = 'clq-Quotation';

@Injectable()
export class CathLabQuotationService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>, private db: FirestoreService) {
    console.log('create service');
    this.loadProducts().subscribe((products) => this.store.dispatch(ClqStoreActions.fetchProducts({ prods: products })));
    this.loadQuotations().subscribe((quotations) => this.store.dispatch(ClqStoreActions.fetchQuotations({ quots: quotations })));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  //#region Product

  loadProducts() {
    return this.db.colWithIds$<Product>(DB_PRODUCT, (ref) => ref.orderBy('name'));
  }

  addProduct(product: Product) {
    this.db.add(DB_PRODUCT, product);
  }

  updateProduct(product: Product) {
    this.db.update(DB_PRODUCT + '/' + product.id, product);
  }

  //#endregion

  //#region Quotation

  loadQuotations() {
    return this.db.colWithIds$<Quotation>(DB_QUOTATION);
  }

  addQuotation(quotation: Quotation) {
    this.db.add(DB_QUOTATION, quotation);
  }

  updateQuotation(quotation: Quotation) {
    this.db.update(DB_QUOTATION + '/' + quotation.id, quotation);
  }

  //#endregion
}
