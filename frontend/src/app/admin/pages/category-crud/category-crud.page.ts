import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TranslocoModule } from '@jsverse/transloco';
import { AdminApiService } from '../../services/admin-api.service';
import { BicycleCategory } from '../../../core/models/entities';

@Component({
  selector: 'app-category-crud-page',
  standalone: true,
  imports: [...SHARED_IMPORTS, CardModule, ButtonModule, TableModule, TranslocoModule],
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
