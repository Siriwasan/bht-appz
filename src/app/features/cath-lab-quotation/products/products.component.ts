import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import * as mock from '../cath-lab-quotation.mock';
import { ProductGroup, Product, GroupBy } from '../cath-lab-quotation.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductComponent } from '../product/product.component';

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

  displayedColumns: string[] = ['description', 'name', 'brand', 'category', 'thaiPrice', 'interPrice', 'status', 'updatedDateTime'];
  dataSource: MatTableDataSource<Product | GroupBy>;

  constructor(private dialog: MatDialog) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.groupingProducts();
    this.flattenGroupedProducts();
  }

  private groupingProducts() {
    this.groupedProducts = [];
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
    this.groupedProducts = this.groupedProducts.sort((a, b) => (a.group < b.group ? -1 : a.group > b.group ? 1 : 0));
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

  private productDialog(product: Product) {
    return this.dialog.open(ProductComponent, {
      width: 'auto',
      disableClose: true,
      autoFocus: true,
      data: product,
    });
  }

  productClicked(product: Product) {
    this.productDialog(product)
      .afterClosed()
      .subscribe((result: Product) => {
        if (result) {
          const index = this.products.findIndex((el) => el.id === result.id);
          this.products[index] = result;

          this.groupingProducts();
          this.flattenGroupedProducts();
        }
      });
  }

  addClicked() {
    this.productDialog(null)
      .afterClosed()
      .subscribe((result: Product) => {
        if (result) {
          this.products.push(result);

          this.groupingProducts();
          this.flattenGroupedProducts();
        }
      });
  }
}
