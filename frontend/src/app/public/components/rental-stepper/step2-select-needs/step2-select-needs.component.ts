import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { AvailabilitySummary, RentalNeeds } from '../../../../core/models/rental-stepper';
import { Accessory } from '../../../../core/models/entities';

@Component({
  selector: 'app-step2-select-needs',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, MessageModule, DividerModule],
  templateUrl: './step2-select-needs.component.html',
  styleUrls: ['./step2-select-needs.component.scss']
})
export class Step2SelectNeedsComponent {
  @Input() limits: AvailabilitySummary | null = null;
  @Input() accessories: Accessory[] = [];
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<RentalNeeds>();

  men = 0;
  women = 0;
  children = 0;
  accessorySelection: Record<number, number> = {};
  error = '';

  increment(field: 'men' | 'women' | 'children') {
    if (this.limits && (this as any)[field] >= (this.limits as any)[field]) {
      return;
    }
    (this as any)[field]++;
  }

  decrement(field: 'men' | 'women' | 'children') {
    if ((this as any)[field] <= 0) return;
    (this as any)[field]--;
  }

  updateAccessory(id: number, delta: number, maxAvailable: number) {
    const current = this.accessorySelection[id] || 0;
    const nextValue = Math.min(Math.max(current + delta, 0), maxAvailable);
    this.accessorySelection[id] = nextValue;
  }

  onNext() {
    this.error = '';
    if (this.men + this.women + this.children <= 0) {
      this.error = 'Legalább egy kerékpárt válassz ki.';
      return;
    }
    this.next.emit({
      men: this.men,
      women: this.women,
      children: this.children,
      accessories: this.accessorySelection
    });
  }
}
