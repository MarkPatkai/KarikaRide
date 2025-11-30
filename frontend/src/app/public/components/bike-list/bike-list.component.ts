import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bicycle } from '../../../core/models/entities';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-bike-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TranslocoModule],
  templateUrl: './bike-list.component.html'
})
export class BikeListComponent {
  @Input() bicycles: Bicycle[] = [];
  @Output() selectBike = new EventEmitter<Bicycle>();
}
