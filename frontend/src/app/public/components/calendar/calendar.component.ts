import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent {
  @Input() fromDatetime?: string;
  @Input() toDatetime?: string;
  @Output() dateRangeSelected = new EventEmitter<{ from: string; to: string }>();

  onDatesChange(values: any) {
    const [from, to] = values || [];
    if (from && to) {
      this.dateRangeSelected.emit({ from: from.toISOString(), to: to.toISOString() });
    }
  }
}
