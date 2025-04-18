import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CommonModule } from "@angular/common";
import { ProductsService } from "app/products/data-access/products.service";
import { MessageService } from "primeng/api";
import { createEmptyProduct, ProductDB } from "app/products/data-access/productDB.model";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  @Input() set product(value: ProductDB | null) {
    this.formData = value ? { ...value } : createEmptyProduct();
  }

  @Output() save = new EventEmitter<ProductDB>();
  @Output() cancel = new EventEmitter<void>();

  formData: ProductDB = createEmptyProduct();
  loading = false;

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService
  ) {}

  submit() {
    if (this.isFormValid()) {
      this.loading = true;
      
      console.log('Submitting product:', this.formData);
  
      this.productsService.create(this.formData).subscribe({
        next: (createdProduct: ProductDB) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Produit créé avec succès'
          });
          this.save.emit(createdProduct);
          this.loading = false;
        },
        error: (err) => {
          console.error('Create product error:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.error?.message || 'Erreur lors de la création du produit'
          });
          this.loading = false;
        }
      });
    }
  }

  private isFormValid(): boolean {
    return !!this.formData.name && this.formData.price >= 0;
  }
}
