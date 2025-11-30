import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../services/admin-api.service';
import { Accessory } from '../../../core/models/entities';

@Component({
  selector: 'app-accessory-crud-page',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, TranslocoModule],
  templateUrl: './accessory-crud.page.html'
})
export class AccessoryCrudPage implements OnInit {
  accessories: Accessory[] = [];

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.api.accessories().subscribe(a => (this.accessories = a));
  }
}
