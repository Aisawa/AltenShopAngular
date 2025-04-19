import { AsyncPipe, CommonModule, CurrencyPipe } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { AuthService } from "app/auth.service";
import { CartService } from "app/cart/cart.service";
import { Product } from "app/products/data-access/product.model";
import { ProductDB } from "app/products/data-access/productDB.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    CommonModule,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  //public readonly editedProduct = signal<Product>(emptyProduct);
  editedProduct: ProductDB | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.editedProduct = null;
    this.isDialogVisible = true;
  }

  public onUpdate(product: ProductDB) {
    this.editedProduct = product;
    this.isDialogVisible = true;
  }

  public onDelete(product: ProductDB) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: ProductDB) {
    const operation = product.id
      ? this.productsService.update(product)
      : this.productsService.create(product);

    operation.subscribe(() => {
      this.isDialogVisible = false;
    });
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  get isAdmin(): boolean {
    const isAdmin = this.authService.isAdmin();
    console.log('Is admin?', isAdmin, 'User email:', this.authService.currentUserValue?.email);
    return isAdmin;
  }
}
