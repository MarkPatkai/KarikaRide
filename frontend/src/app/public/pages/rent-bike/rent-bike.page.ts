import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { TranslocoModule } from '@jsverse/transloco';
import { Step1SelectDateComponent } from '../../components/rental-stepper/step1-select-date/step1-select-date.component';
import { Step2SelectNeedsComponent } from '../../components/rental-stepper/step2-select-needs/step2-select-needs.component';
import { Step3SelectBikesComponent } from '../../components/rental-stepper/step3-select-bikes/step3-select-bikes.component';
import { Accessory, Bicycle } from '../../../core/models/entities';
import { AvailabilityService } from '../../services/availability.service';
import { BicycleService } from '../../services/bicycle.service';
import { ContactService } from '../../services/contact.service';
import {
  AvailabilityListResponse,
  AvailabilitySummary,
  ContactInfo,
  RentalNeeds,
  RentalStepperState
} from '../../../core/models/rental-stepper';

@Component({
  selector: 'app-rent-bike',
  standalone: true,
  imports: [
    CommonModule,
    StepsModule,
    MessageModule,
    CardModule,
    TranslocoModule,
    Step1SelectDateComponent,
    Step2SelectNeedsComponent,
    Step3SelectBikesComponent,
    CardModule
  ],
  templateUrl: './rent-bike.page.html'
})
export class RentBikePage implements OnInit {
  activeIndex = 0;
  items = [
    { label: 'Időpont' },
    { label: 'Szükségletek' },
    { label: 'Biciklik' }
  ];

  accessories: Accessory[] = [];
  summary: AvailabilitySummary | null = null;
  availability: AvailabilityListResponse<Bicycle, Accessory> | null = null;
  contactInfo: ContactInfo | null = null;
  errorMessage = '';

  state: RentalStepperState = {
    step1: { from: null, to: null },
    step2: { men: 0, women: 0, children: 0, accessories: {} },
    step3: { selectedMen: [], selectedWomen: [], selectedChildren: [], selectedAccessories: [] }
  };

  constructor(
    private availabilityService: AvailabilityService,
    private bicycleService: BicycleService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.bicycleService.listAccessories().subscribe(data => (this.accessories = data));
    this.contactService.getContactInfo().subscribe(info => (this.contactInfo = info));
  }

  onSelectDate(range: { from: Date; to: Date }) {
    this.state.step1 = range;
    const fromDate = new Date(range.from);
    const toDate = new Date(range.to);
    this.availabilityService.getAvailabilitySummary(fromDate.toISOString(), toDate.toISOString()).subscribe(summary => {
      this.summary = summary;
      this.activeIndex = 1;
    });
  }

  onSelectNeeds(payload: RentalNeeds) {
    this.state.step2 = payload;
    if (!this.state.step1.from || !this.state.step1.to) return;
    const fromDate = typeof this.state.step1.from === 'string' ? this.state.step1.from : new Date(this.state.step1.from).toISOString();
    const toDate = typeof this.state.step1.to === 'string' ? this.state.step1.to : new Date(this.state.step1.to).toISOString();
    this.availabilityService
      .listAvailability(fromDate, toDate, payload)
      .subscribe({
        next: result => {
          this.errorMessage = '';
          this.availability = result;
          this.activeIndex = 2;
        },
        error: err => {
          if (err.status === 409 && err.error?.error === 'not enough bikes') {
            this.errorMessage = 'Sajnos nincs elérhető bringa erre az időpontra!';
            this.activeIndex = 2;
          }
        }
      });
  }

  onConfirmSelection(selection: {
    men: number[];
    women: number[];
    children: number[];
    accessories: number[];
  }) {
    this.state.step3 = {
      selectedMen: selection.men,
      selectedWomen: selection.women,
      selectedChildren: selection.children,
      selectedAccessories: selection.accessories
    };
  }

  goBack(to: number) {
    this.activeIndex = to;
  }
}
