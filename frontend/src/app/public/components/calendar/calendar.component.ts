import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, CardModule, TranslocoModule],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent {
  @Input() fromDatetime?: string;
  @Input() toDatetime?: string;
  @Output() dateRangeSelected = new EventEmitter<{ from: string; to: string }>();

  selectedRange: Date[] = [];

  onDatesChange(values: any) {
    this.selectedRange = values || [];
  }

  confirmRange() {
    const [from, to] = this.selectedRange || [];
    if (!from || !to) return;
    this.dateRangeSelected.emit({ from: from.toISOString(), to: to.toISOString() });
  }

  get isRangeComplete() {
    const [from, to] = this.selectedRange || [];
    return !!from && !!to;
  }
}
