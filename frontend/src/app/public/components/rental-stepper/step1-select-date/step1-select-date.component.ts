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
  startDate: Date | null = null;
  endDate: Date | null = null;
  isAllDay: boolean = false;

  onDateChange() {
    if (this.isAllDay) {
      const start = this.startDate;
      if (start) {
        this.endDate = new Date(start);
        this.endDate.setDate(this.endDate.getDate() + 1); // Set end date to the next day
      }
    }
  }

  onNext() {
    this.error = '';
    const from = this.startDate;
    const to = this.endDate || this.startDate;

    if (!from || !to) {
      this.error = 'Please select both start and end dates.';
      return;
    }

      if ((from >= to) && !this.isAllDay) { 
      this.error = 'End date must be after start date.';
      return;
    }

    this.next.emit({ from, to });
  }
}
