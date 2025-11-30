import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
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
