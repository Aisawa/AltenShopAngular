import { Injectable, inject, signal } from "@angular/core";
import { ApiResponse, Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly path = "/api/products";
  private readonly baseUrl = `${environment.apiUrl}/products`;

  private readonly _products = signal<Product[]>([]);

  public readonly products = this._products.asReadonly();

  public get(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.baseUrl).pipe(
      map((response: ApiResponse<Product[]>) => response.data || []),
      tap((products: Product[]) => this._products.set(products)),
      catchError((error): Observable<Product[]> => {
        return this.handleError<Product[]>("fetch", error, []);
      })
    );
  }

  public create(product: Omit<Product, "id">): Observable<Product | null> {
    return this.http.post<ApiResponse<Product>>(this.baseUrl, product).pipe(
      map((response) => response.data || null),
      tap((newProduct) => {
        if (newProduct) {
          this._products.update((products) => [newProduct, ...products]);
        }
      }),
      catchError((error) => this.handleError("create", error, null))
    );
  }

  public update(product: Product): Observable<Product | null> {
    return this.http
      .patch<ApiResponse<Product>>(`${this.baseUrl}/${product.id}`, product)
      .pipe(
        map((response) => response.data || null),
        tap((updatedProduct) => {
          if (updatedProduct) {
            this._products.update((products) =>
              products.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p
              )
            );
          }
        }),
        catchError((error) => this.handleError("update", error, null))
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
