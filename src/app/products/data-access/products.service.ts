import { Injectable, inject, signal } from "@angular/core";
import { ApiResponse, Product } from "./product.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of, tap, throwError } from "rxjs";
import { environment } from "environments/environment";
import { AuthService } from "app/auth.service";
import { Router } from "@angular/router";
import { ProductDB } from "./productDB.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/products";
  private readonly baseUrl = `${environment.apiUrl}/products`;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _products = signal<ProductDB[]>([]);

  public readonly products = this._products.asReadonly();

  // public get(): Observable<Product[]> {
  //   return this.http.get<ApiResponse<Product[]>>(this.baseUrl).pipe(
  //     map((response: ApiResponse<Product[]>) => response.data || []),
  //     tap((products: Product[]) => this._products.set(products)),
  //     catchError((error): Observable<Product[]> => {
  //       return this.handleError<Product[]>("fetch", error, []);
  //     })
  //   );
  // }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    console.log('mockAdmin:', environment.mockAdmin);
    if (!environment.mockAdmin && this.authService.token) {
      headers = headers.set('Authorization', `Bearer ${this.authService.token}`);
    }
    
    return headers;
  }

  public get(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.baseUrl).pipe(
      map((response: ApiResponse<Product[]>) => response.data || []),
      tap((products: Product[]) => this._products.set(products)),
      catchError((error): Observable<Product[]> => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return this.handleError<Product[]>("fetch", error, []);
      })
    );
  }

  public create(product: Omit<ProductDB, "id">): Observable<ProductDB> {  
    return this.http.post<ApiResponse<ProductDB>>(this.baseUrl, product, { headers: this.getAuthHeaders() }).pipe(
      map((response) => {
        if (!response.data) {
          throw new Error('No product data in response');
        }
        return response.data;
      }),
      tap((newProduct) => {
        this._products.update((products) => [newProduct, ...products]);
      }),
      catchError((error) => {
        console.error('Error creating product:', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        throw error; // Propage l'erreur au lieu de retourner null
      })
    );
  }

  public update(product: ProductDB): Observable<ProductDB> {
    return this.http
      .put<ApiResponse<ProductDB>>(`${this.baseUrl}/${product.id}`, product, { headers: this.getAuthHeaders() })
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error('No product data in response');
          }
          return response.data;
        }),
        tap((updatedProduct) => {
          this._products.update((products) =>
            products.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            )
          );
        }),
        catchError((error) => {
          console.error('Error updating product:', error);
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          throw error;
        })
      );
  }

  public delete(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map((response) => response.success),
      tap((success) => {
        if (success) {
          this._products.update((products) =>
            products.filter((p) => p.id !== id)
          );
        }
      }),
      catchError((error) => this.handleError("delete", error, false))
    );
  }

  private handleError<T>(
    operation: string,
    error: any,
    fallback: T
  ): Observable<T> {
    console.error(`Product ${operation} error:`, error);
    // Vous pourriez ajouter ici un service de notification/toast
    return of(fallback);
  }
}
