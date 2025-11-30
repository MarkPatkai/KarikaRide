import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bicycle } from '../../../core/models/entities';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bike-list',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './bike-list.component.html'
})
export class BikeListComponent {
  @Input() bicycles: Bicycle[] = [];
  @Output() selectBike = new EventEmitter<Bicycle>();
}
