import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CommonModule } from "@angular/common";
import { Product } from "app/products/data-access/product.model";

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
  ],
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent {
  @Input() set product(value: Product | null) {
    this.formData = value ? { ...value } : this.emptyProduct;
  }

  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  formData: Product = this.emptyProduct;

  private get emptyProduct(): Product {
    return {
      id: 0,
      name: "",
      description: "",
      price: 0,
      category: "",
      code: "",
      image: "",
      quantity: 0,
      inventoryStatus: "INSTOCK",
      internalReference: "",
      shellId: 0,
      rating: 0,
      createdAt: 0,
      updatedAt: 0,
    };
  }

  submit() {
    if (this.isFormValid()) {
      this.save.emit(this.formData);
    }
  }

  private isFormValid(): boolean {
    return !!this.formData.name && this.formData.price >= 0;
  }
}
