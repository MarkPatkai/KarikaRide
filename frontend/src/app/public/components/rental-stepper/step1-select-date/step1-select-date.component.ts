import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step1-select-date',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, CalendarModule, ButtonModule, MessageModule],
  templateUrl: './step1-select-date.component.html',
  styleUrls: ['./step1-select-date.component.scss']
})
export class Step1SelectDateComponent {
  @Output() next = new EventEmitter<{ from: Date; to: Date }>();

  range: Date[] = [];
  error = '';

  onNext() {
    this.error = '';
    const [from, to] = this.range;
    if (!from || !to) {
      this.error = 'Kérjük, válassz kezdő és záró időpontot.';
      return;
    }

    const diffMs = to.getTime() - from.getTime();
    if (diffMs < 60 * 60 * 1000) {
      this.error = 'Legalább 1 órás bérlés szükséges.';
      return;
    }

    this.next.emit({ from, to });
  }
}
