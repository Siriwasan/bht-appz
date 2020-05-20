import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import * as mock from '../cath-lab-quotation.mock';
import { ProductGroup, Product, GroupBy } from '../cath-lab-quotation.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  private products = mock.products;
  private groupedProducts: ProductGroup[] = [];
  private flattedProducts: (Product | GroupBy)[] = [];
  private collapsedGroup: GroupBy[] = [];

  displayedColumns: string[] = ['name', 'brand', 'category', 'thaiPrice', 'interPrice', 'updatedDateTime'];
  dataSource: MatTableDataSource<Product | GroupBy>;

  constructor() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.groupData();
    this.flattenGroupedProducts();
  }

  private groupData() {
    this.products.forEach(
      ((hash: ProductGroup) => {
        return (a: Product) => {
          if (!hash[a.category]) {
            hash[a.category] = { group: a.category, products: [] } as ProductGroup;
            this.groupedProducts.push(hash[a.category]);
          }
          hash[a.category].products.push(a);
        };
      })(Object.create(null))
    );
  }

  private flattenGroupedProducts() {
    this.flattedProducts = [];
    this.groupedProducts.forEach((g) => {
      const isGroupCollapsed = this.collapsedGroup.find((gr) => gr.group === g.group)?.collapsed;
      this.flattedProducts.push({ group: g.group, label: `${g.group} (${g.products.length})`, isGroup: true, collapsed: isGroupCollapsed });
      if (!isGroupCollapsed) {
        g.products.forEach((m) => this.flattedProducts.push(m));
      }
    });
    this.dataSource = new MatTableDataSource(this.flattedProducts);
  }

  isGroup(index, item): boolean {
    return item.isGroup;
  }

  groupClicked(group: GroupBy) {
    group.collapsed = !group.collapsed;
    if (group.collapsed) {
      this.collapsedGroup.push(group);
    } else {
      this.collapsedGroup = this.collapsedGroup.filter((el) => el.group !== group.group);
    }

    this.flattenGroupedProducts();
  }

  productClicked(product: Product) {
    console.log(product);
  }
}
