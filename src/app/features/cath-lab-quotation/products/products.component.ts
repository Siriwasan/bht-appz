import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { ProductGroup, Product, GroupBy } from '../cath-lab-quotation.model';
import { ProductComponent } from '../product/product.component';
import { CathLabQuotationService } from '../cath-lab-quotation.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/root-store.state';
import { ClqStoreSelectors } from 'src/app/store/cath-lab-quotation';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private products: Product[];
  private groupedProducts: ProductGroup[] = [];
  private flattedProducts: (Product | GroupBy)[] = [];
  private collapsedGroup: GroupBy[] = [];

  displayedColumns: string[] = ['description', 'name', 'brand', 'category', 'thaiPrice', 'interPrice', 'status', 'updatedAt'];
  dataSource: MatTableDataSource<Product | GroupBy>;

  constructor(private dialog: MatDialog, private store: Store<AppState>, private quotationService: CathLabQuotationService) {
    this.subscriptions.push(
      this.store.select(ClqStoreSelectors.products).subscribe((products) => {
        this.products = products;
        this.groupingProducts();
        this.flattenGroupedProducts();
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    // this.groupingProducts();
    // this.flattenGroupedProducts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private groupingProducts() {
    this.groupedProducts = [];
    this.products?.forEach(
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
      .subscribe((result: Product) => this.updateProduct(result));
  }

  addClicked() {
    this.productDialog(null)
      .afterClosed()
      .subscribe((result: Product) => this.addProduct(result));
  }

  addProduct(product: Product) {
    if (product) {
      this.quotationService.addProduct(product);
    }
  }

  updateProduct(product: Product) {
    if (product) {
      this.quotationService.updateProduct(product);
    }
  }
}
