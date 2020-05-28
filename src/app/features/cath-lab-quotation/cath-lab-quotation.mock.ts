import { Product, Quotation, GroupBy } from './cath-lab-quotation.model';

export const products: Product[] = [
  {
    id: 1,
    name: 'Stent 1',
    description: null,
    brand: 'Company 1',
    category: 'Stent',
    thaiPrice: 1000,
    interPrice: 1500,
    status: 'In stock',
  },
  {
    id: 2,
    name: 'Wire 1',
    description: 'Very good wire',
    brand: 'Company 1',
    category: 'Wire',
    thaiPrice: 100,
    interPrice: 150,
    status: 'In stock',
  },
  {
    id: 3,
    name: 'Stent 2',
    description: 'Best of stent',
    brand: 'Company 1',
    category: 'Stent',
    thaiPrice: 2000,
    interPrice: 3000,
    status: 'Discontinue',
  },
  {
    id: 4,
    name: 'Stent 3',
    description: null,
    brand: 'Company 2',
    category: 'Stent',
    thaiPrice: 3000,
    interPrice: 4500,
    status: 'In stock',
  },
  {
    id: 5,
    name: 'Wire 2',
    description: null,
    brand: 'Company 2',
    category: 'Wire',
    thaiPrice: 300,
    interPrice: 450,
    status: 'Postpone',
  },
  {
    id: 6,
    name: 'Set 1',
    description: null,
    brand: 'BHT',
    category: '# Pre-set #',
    subProducts: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
    ],
    thaiPrice: 300,
    interPrice: 450,
    status: 'In stock',
  },
  {
    id: 7,
    name: 'Bundle 1',
    description: null,
    brand: 'BHT',
    category: '# Bundle #',
    subProducts: [
      { productId: 3, quantity: 1 },
      { productId: 5, quantity: 2 },
    ],
    thaiPrice: 300,
    interPrice: 450,
    status: 'In stock',
  },
  {
    id: 8,
    name: 'Bundle 2',
    description: null,
    brand: 'BHT',
    category: '# Bundle #',
    subProducts: [{ productId: 5, quantity: 2 }],
    thaiPrice: 1000,
    interPrice: 1500,
    status: 'In stock',
  },
  {
    id: 9,
    name: 'Bundle 3',
    description: null,
    brand: 'BHT',
    category: '# Bundle #',
    subProducts: [{ productId: 3, quantity: 2 }],
    thaiPrice: 1500,
    interPrice: 1800,
    status: 'In stock',
  },
];

export const quotations: Quotation[] = [
  {
    id: '01200001',
    hn: '0119043704',
    an: '01190015737',
    patient: 'Mr. Alexio Lemmer',
    birthdate: null,
    age: 40,
    payment: 'thai',
    physician: 'นพ.ดำรัส ตรีสุโกศล',
    procedure: 'CAG',
    procedureDateTime: null,
    useProducts: [
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 1 },
      { product: products[3], quantity: 1 },
    ],
    usePrice: 12344,
    priceVariation: 10,
    estimatedPrice: '',
    quotedBy: 'คุณ อริย์ธัช',
  },
  {
    id: '01200002',
    hn: '0119234204',
    an: '01193423457',
    patient: 'Ms. Charyl Vasilyonok',
    birthdate: null,
    age: 50,
    payment: 'inter',
    physician: 'นพ.ดำรัส ตรีสุโกศล',
    procedure: 'CAG + PCI',
    procedureDateTime: null,
    useProducts: [
      { product: products[0], quantity: 2 },
      { product: products[2], quantity: 2 },
      { product: products[4], quantity: 2 },
    ],
    usePrice: 45000,
    priceVariation: 5,
    estimatedPrice: '',
    quotedBy: 'คุณ อริย์ธัช',
  },
  {
    id: '01200003',
    hn: '0119043435',
    an: '01190014354',
    patient: 'Mr. Tyrus Dentith',
    birthdate: null,
    age: 60,
    payment: 'thai',
    physician: 'นพ.ดำรัส ตรีสุโกศล',
    procedure: 'PCI',
    procedureDateTime: null,
    useProducts: [
      { product: products[1], quantity: 1 },
      { product: products[2], quantity: 2 },
      { product: products[3], quantity: 3 },
    ],
    usePrice: 67000,
    priceVariation: 15,
    estimatedPrice: '',
    quotedBy: 'คุณ อริย์ธัช',
  },
];
