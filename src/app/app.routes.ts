import { Routes } from '@angular/router';
import { ProductList } from './products/product-list';
import { ProductForm } from './products/product-form';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'create', component: ProductForm },
  { path: 'edit/:id', component: ProductForm },
  { path: '**', redirectTo: '' }
];
