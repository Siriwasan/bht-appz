import { Injectable } from '@angular/core';

import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Product } from './cath-lab-quotation.model';

@Injectable({
  providedIn: 'root',
})
export class CathLabQuotationService {
  constructor(private db: FirestoreService) {}

  addProduct(product: Product) {
    this.db.add('clq-Product', product);
  }
}
