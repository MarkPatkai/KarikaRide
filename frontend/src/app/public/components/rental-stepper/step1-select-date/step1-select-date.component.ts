import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { RentalDateData } from '../../../../core/models/rental-stepper';
import { loadWithTTL, saveWithTTL } from '../../../utils/storage-ttl';

interface StoredStep1Data {
  startDate: string | null;
  endDate: string | null;
  multiDay: boolean;
  arrivalTime: string;
  timestamp?: number;
}

@Component({
  selector: 'app-step1-select-date',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule, CardModule, CalendarModule, CheckboxModule, ButtonModule, MessageModule],
  templateUrl: './step1-select-date.component.html',
  styleUrls: ['./step1-select-date.component.scss']
})
export class Step1SelectDateComponent implements OnInit {
  @Output() next = new EventEmitter<RentalDateData>();

  private readonly STORAGE_KEY = 'rental_step1';
  private readonly TTL_MS = 3_600_000;

  today = new Date();
  startDate: Date | null = null;
  endDate: Date | null = null;
  multiDay = false;
  arrivalTime: Date | null = null;
  arrivalTimeValue = '';

  constructor() {
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.restoreFromStorage();
  }

  get isRangeInvalid(): boolean {
    return this.multiDay && !!this.startDate && !!this.endDate && this.endDate < this.startDate;
  }

  get isInvalid(): boolean {
    return !this.startDate || !this.arrivalTimeValue || (this.multiDay && !this.endDate) || this.isRangeInvalid;
  }

  onStartDateChange(value: Date | null) {
    this.startDate = value;
    if (this.multiDay && this.endDate && this.startDate && this.endDate < this.startDate) {
      this.endDate = this.startDate;
    }
    this.persistState();
  }

  onEndDateChange(value: Date | null) {
    this.endDate = value;
    this.persistState();
  }

  toggleMultiDay(value: boolean) {
    this.multiDay = value;
    if (!value) {
      this.endDate = null;
    } else if (this.startDate && (!this.endDate || this.endDate < this.startDate)) {
      this.endDate = this.startDate;
    }
    this.persistState();
  }

  onArrivalTimeChange(value: Date | null) {
    this.arrivalTime = value;
    this.arrivalTimeValue = value ? this.formatTime(value) : '';
    this.persistState();
  }

  onNext() {
    if (this.isInvalid || !this.startDate || !this.arrivalTimeValue) {
      return;
    }

    const payload: RentalDateData = {
      startDate: this.startDate,
      endDate: this.multiDay ? this.endDate ?? this.startDate : undefined,
      multiDay: this.multiDay,
      arrivalTime: this.arrivalTimeValue
    };

    this.persistState();
    this.next.emit(payload);
  }

  private persistState() {
    const payload: StoredStep1Data = {
      startDate: this.startDate ? this.startDate.toISOString() : null,
      endDate: this.endDate ? this.endDate.toISOString() : null,
      multiDay: this.multiDay,
      arrivalTime: this.arrivalTimeValue
    };
    saveWithTTL(this.STORAGE_KEY, payload, this.TTL_MS);
  }

  private restoreFromStorage() {
    const saved = loadWithTTL<StoredStep1Data>(this.STORAGE_KEY, this.TTL_MS);
    if (!saved) return;

    this.startDate = saved.startDate ? new Date(saved.startDate) : null;
    this.endDate = saved.endDate ? new Date(saved.endDate) : null;
    this.multiDay = saved.multiDay;
    this.arrivalTimeValue = saved.arrivalTime || '';
    this.arrivalTime = this.arrivalTimeValue ? this.parseTime(this.arrivalTimeValue) : null;
  }

  private formatTime(date: Date): string {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private parseTime(value: string): Date {
    const [hours, minutes] = value.split(':').map(part => parseInt(part, 10));
    const result = new Date();
    result.setHours(hours || 0, minutes || 0, 0, 0);
    return result;
  }
}
