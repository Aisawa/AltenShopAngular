import { Component, inject, computed } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from "./cart/cart.service";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule, ButtonModule],
})
export class AppComponent {
  title = "ALTEN SHOP";
  private cartService = inject(CartService);
  
  cartItemCount = computed(() => this.cartService.items().length);
}