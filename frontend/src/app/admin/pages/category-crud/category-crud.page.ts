import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';
import { BicycleCategory } from '../../../core/models/entities';

@Component({
  selector: 'app-category-crud-page',
  templateUrl: './category-crud.page.html'
})
export class CategoryCrudPage implements OnInit {
  categories: BicycleCategory[] = [];
  form: Partial<BicycleCategory> = { name: '', priceDay: 0, priceHour: 0, description: '' };

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.categories().subscribe(c => (this.categories = c));
  }

  save() {
    this.api.saveCategory(this.form).subscribe(() => this.load());
  }
}
