import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';
import { Bicycle, BicycleCategory } from '../../../core/models/entities';

@Component({
  selector: 'app-bicycle-crud-page',
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
