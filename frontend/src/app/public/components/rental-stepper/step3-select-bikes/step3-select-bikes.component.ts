import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { Bicycle, Accessory } from '../../../../core/models/entities';
import { ContactInfo } from '../../../../core/models/rental-stepper';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-step3-select-bikes',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, MessageModule, ChipModule, TranslocoModule],
  templateUrl: './step3-select-bikes.component.html',
  styleUrls: ['./step3-select-bikes.component.scss']
})
export class Step3SelectBikesComponent {
  @Input() men: Bicycle[] = [];
  @Input() women: Bicycle[] = [];
  @Input() children: Bicycle[] = [];
  @Input() accessories: Accessory[] = [];
  @Input() needs: { men: number; women: number; children: number; accessories: Record<number, number> } | null = null;
  @Input() contactInfo: ContactInfo | null = null;
  @Input() error = '';

  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{
    men: number[];
    women: number[];
    children: number[];
    accessories: number[];
  }>();

  selectedMen = new Set<number>();
  selectedWomen = new Set<number>();
  selectedChildren = new Set<number>();
  selectedAccessories = new Set<number>();

  toggleSelection(bucket: 'men' | 'women' | 'children', id: number) {
    const limit = this.needs ? (this.needs as any)[bucket] : 0;
    const target = bucket === 'men' ? this.selectedMen : bucket === 'women' ? this.selectedWomen : this.selectedChildren;

    if (target.has(id)) {
      target.delete(id);
      return;
    }

    if (target.size >= limit) {
      return;
    }

    target.add(id);
  }

  toggleAccessory(id: number, allowed: number) {
    if (this.selectedAccessories.has(id)) {
      this.selectedAccessories.delete(id);
    } else {
      if (this.selectedAccessories.size >= allowed) {
        return;
      }
      this.selectedAccessories.add(id);
    }
  }

  onConfirm() {
    this.confirm.emit({
      men: Array.from(this.selectedMen),
      women: Array.from(this.selectedWomen),
      children: Array.from(this.selectedChildren),
      accessories: Array.from(this.selectedAccessories)
    });
  }
}
