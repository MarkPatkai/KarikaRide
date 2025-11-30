export interface RentalStepperState {
  step1: {
    from: Date | null;
    to: Date | null;
  };
  step2: {
    men: number;
    women: number;
    children: number;
    accessories: { [id: number]: number };
  };
  step3: {
    selectedMen: number[];
    selectedWomen: number[];
    selectedChildren: number[];
    selectedAccessories: number[];
  };
}

export interface AvailabilitySummary {
  men: number;
  women: number;
  children: number;
  accessories: Record<number, number>;
}

export interface RentalNeeds {
  men: number;
  women: number;
  children: number;
  accessories: Record<number, number>;
}

export interface AvailabilityListResponse<TBike, TAccessory> {
  men: TBike[];
  women: TBike[];
  children: TBike[];
  accessories: TAccessory[];
}

export interface ContactInfo {
  email: string;
  phone: string;
}
