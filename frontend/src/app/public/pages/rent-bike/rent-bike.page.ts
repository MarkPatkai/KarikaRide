import { Component, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { BikeListComponent } from '../../components/bike-list/bike-list.component';
import { BikeDetailsComponent } from '../../components/bike-details/bike-details.component';
import { Bicycle, BicycleCategory, CreateRentalRequest } from '../../../core/models/entities';
import { AvailabilityService } from '../../services/availability.service';
import { BicycleService } from '../../services/bicycle.service';
import { CategoryService } from '../../services/category.service';
import { RentalService } from '../../services/rental.service';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-rent-bike',
  standalone: true,
  imports: [
    CommonModule,
    ChipModule,
    TranslocoModule,
    CalendarComponent,
    BikeListComponent,
    BikeDetailsComponent
  ],
  templateUrl: './rent-bike.page.html'
})
export class RentBikePage implements OnInit {
  categories: BicycleCategory[] = [];
  bicycles: Bicycle[] = [];
  selectedCategory?: BicycleCategory;
  selectedBike?: Bicycle;
  bookingRange?: { from: string; to: string };
  statusMessage = '';

  constructor(
    private availabilityService: AvailabilityService,
    private bicycleService: BicycleService,
    private categoryService: CategoryService,
    private rentalService: RentalService
  ) {}

  ngOnInit(): void {
    this.categoryService.list().subscribe(categories => (this.categories = categories));
    this.loadBicycles();
  }

  loadBicycles(categoryId?: number) {
    this.bicycleService.list(categoryId).subscribe(bicycles => (this.bicycles = bicycles));
  }

  setCategory(category?: BicycleCategory) {
    this.selectedCategory = category;
    this.loadBicycles(category?.id);
  }

  onDateRangeSelected(range: { from: string; to: string }) {
    this.bookingRange = range;
    this.availabilityService
      .getAvailableBicycles(range.from, range.to)
      .subscribe(bicycles => (this.bicycles = bicycles));
  }

  onSelectBike(bike: Bicycle) {
    this.selectedBike = bike;
  }

  onCreateRental(payload: CreateRentalRequest) {
    this.rentalService.createRental(payload).subscribe(() => {
      this.statusMessage = 'Rental created successfully';
    });
  }
}
