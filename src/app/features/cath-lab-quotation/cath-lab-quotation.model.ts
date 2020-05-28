export interface Product {
  id?: string;
  name: string;
  description: string;
  brand: string;
  category: string; // 'Stent', 'Wire', 'Balloon', '# Pre-set #', '# Bundle #'
  subProducts?: SubProduct[];
  thaiPrice: number;
  interPrice: number;
  status: string; // 'In stock', 'Discontinued', 'Postpone'
  note?: string;
  createdAt?: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
}

export interface SubProduct {
  productId: string;
  quantity: number;
}

export interface ProductGroup {
  group: string;
  products: Product[];
}

export interface GroupBy {
  group: string;
  label: string;
  isGroup: boolean;
  collapsed: boolean;
}

export interface ProductOrder {
  product: Product;
  quantity: number;
}

export interface Quotation {
  id: string;
  hn: string;
  an: string;
  patient: string;
  birthdate: firebase.firestore.Timestamp;
  age: number;
  payment: string;
  physician: string;
  procedure: string;
  procedureDateTime: firebase.firestore.Timestamp;
  useProducts: ProductOrder[];
  usePrice: number;
  backupProducts?: ProductOrder[];
  backupPrice?: number;
  priceVariation: number;
  estimatedPrice: string;
  note?: string;
  quotedBy: string;
  createdAt?: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
}
