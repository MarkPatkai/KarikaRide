import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bicycle } from '../../../core/models/entities';

@Component({
  selector: 'app-bike-list',
  templateUrl: './bike-list.component.html'
})
export class BikeListComponent {
  @Input() bicycles: Bicycle[] = [];
  @Output() selectBike = new EventEmitter<Bicycle>();
}
