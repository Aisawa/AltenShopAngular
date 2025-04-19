import { AsyncPipe, CommonModule, CurrencyPipe } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { AuthService } from "app/auth.service";
import { CartService } from "app/cart/cart.service";
import { Product } from "app/products/data-access/product.model";
import { ProductDB } from "app/products/data-access/productDB.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";

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
    ToastModule,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  editedProduct: ProductDB | null = null;

  constructor(
    private messageService: MessageService
  ) {}

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
    this.messageService.add({
      severity: 'warn',
      summary: 'Confirmation',
      detail: `Voulez-vous vraiment supprimer "${product.name}" ?`,
      sticky: true,
      key: 'confirm',
      data: product,
      closable: false,
      life: 10000
    });
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
    //console.log('Is admin?', isAdmin, 'User email:', this.authService.currentUserValue?.email);
    return isAdmin;
  }

  confirmDelete(product: ProductDB) {
    this.productsService.delete(product.id).subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Produit supprimé avec succès'
          });
        }
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.error?.message || 'Erreur lors de la suppression du produit'
        });
      },
      complete: () => {
        this.clearConfirmMessage();
      }
    });
  }

  clearConfirmMessage() {
    this.messageService.clear('confirm');
  }
}
