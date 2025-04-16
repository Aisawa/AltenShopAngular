import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { CartComponent } from "./cart/cart.component";
<<<<<<< HEAD
import { ContactComponent } from "./contact/contact.component";
=======
>>>>>>> d1bec52109e9a4e212fcc4cd6aa49c479235343c

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES)
  },
  { path: 'cart', component: CartComponent },
<<<<<<< HEAD
  { path: 'contact', component: ContactComponent },
=======
>>>>>>> d1bec52109e9a4e212fcc4cd6aa49c479235343c
  { path: "", redirectTo: "home", pathMatch: "full" },
];
