import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bicycle } from '../../../core/models/entities';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-bike-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './bike-list.component.html'
})
export class BikeListComponent {
  @Input() bicycles: Bicycle[] = [];
  @Output() selectBike = new EventEmitter<Bicycle>();
}
