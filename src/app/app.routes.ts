import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { CartComponent } from "./cart/cart.component";
import { ContactComponent } from "./contact/contact.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";

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
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // {
  //   path: 'products/create',
  //   component: ProductFormComponent, // ou la route appropriée
  //   canActivate: [authGuard, adminGuard]
  // },
  { path: "", redirectTo: "home", pathMatch: "full" },
];
