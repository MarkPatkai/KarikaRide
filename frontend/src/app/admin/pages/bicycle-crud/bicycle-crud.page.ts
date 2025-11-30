import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TranslocoModule } from '@jsverse/transloco';
import { AdminApiService } from '../../services/admin-api.service';
import { Bicycle, BicycleCategory } from '../../../core/models/entities';

@Component({
  selector: 'app-bicycle-crud-page',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CardModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    TranslocoModule
  ],
  templateUrl: './bicycle-crud.page.html'
})
export class BicycleCrudPage implements OnInit {
  bicycles: Bicycle[] = [];
  categories: BicycleCategory[] = [];
  form: Partial<Bicycle> = {
    name: '',
    description: '',
    recommendedFor: '',
    size: '',
    imageUrl: '',
    status: 'active',
    categoryId: 0
  };

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.bicycles().subscribe(b => (this.bicycles = b));
    this.api.categories().subscribe(c => (this.categories = c));
  }

  save() {
    this.api.saveBicycle(this.form).subscribe(() => this.load());
  }
}
