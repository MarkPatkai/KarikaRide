import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';
import { Accessory } from '../../../core/models/entities';

@Component({
  selector: 'app-accessory-crud-page',
  templateUrl: './accessory-crud.page.html'
})
export class AccessoryCrudPage implements OnInit {
  accessories: Accessory[] = [];

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.api.accessories().subscribe(a => (this.accessories = a));
  }
}
