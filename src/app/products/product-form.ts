import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductForm implements OnInit {
  id?: number;
  imageFile?: File;
  saving = false;
  error = '';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ProductService,
    private router: Router
  ) {
    // initialize form inside constructor to avoid any fb undefined issues
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || undefined;

    if (this.id) {
      this.api.get(this.id).subscribe({
        next: (p) => this.form.patchValue({ name: p.name, price: p.price }),
        error: (err) => console.error('Failed to load product', err)
      });
    }
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.saving = true;

    // safely cast form value to non-nullable
    const value = this.form.value as { name: string; price: number };

    const data = { name: value.name.trim(), price: value.price };

    const request = this.id
      ? this.api.update(this.id, data, this.imageFile)
      : this.api.create(data, this.imageFile);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.saving = false;
        console.error('Save failed', err);
        this.error = err?.error?.title || 'Failed to save product';
      }
    });
  }

  cancel(): void {
    this.form.reset({ name: '', price: 0 });
    this.imageFile = undefined;
    this.id = undefined;
    this.router.navigate(['/']);
  }
}
