export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  category: string; // 'Stent', 'Wire', 'Balloon', '# Pre-set #', '# Bundle #'
  subProducts?: { productId: number; quantity: number }[];
  thaiPrice: number;
  interPrice: number;
  status: string; // 'In stock', 'Discontinued', 'Postpone'
  note?: string;
  updatedDateTime: string;
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
  birthdate: string;
  age: number;
  payment: string;
  physician: string;
  procedure: string;
  procedureDateTime: string;
  useProducts: ProductOrder[];
  usePrice: number;
  backupProducts?: ProductOrder[];
  backupPrice?: number;
  priceVariation: number;
  estimatedPrice: string;
  note?: string;
  quotedBy: string;
  quotedDateTime: string;
}
