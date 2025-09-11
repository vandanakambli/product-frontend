import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiBaseUrl}/product`; // match your backend route

  constructor(private http: HttpClient) {}

  // List all products
  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // Get single product by ID
  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // Create product (with optional image)
  create(data: { name: string; price: number }, imageFile?: File): Observable<Product> {
    const formData = this.buildFormData(data, imageFile);
    return this.http.post<Product>(this.baseUrl, formData);
  }

  // Update product (with optional image)
  update(id: number, data: { name: string; price: number }, imageFile?: File): Observable<Product> {
    const formData = this.buildFormData(data, imageFile);
    return this.http.put<Product>(`${this.baseUrl}/${id}`, formData);
  }

  // Delete product
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Helper: build FormData for create/update
  private buildFormData(data: { name: string; price: number }, imageFile?: File): FormData {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    if (imageFile) formData.append('image', imageFile);
    return formData;
  }
}
