export interface Bicycle {
  id: number;
  categoryId: number;
  templateId?: number;
  name: string;
  description: string;
  recommendedFor: string;
  size: string;
  imageUrl: string;
  riderType?: 'men' | 'women' | 'children';
  status: 'active' | 'inactive';
}

export interface BicycleTemplate {
  id: number;
  name: string;
  description: string;
  recommendedFor: string;
  size: string;
}

export interface BicycleCategory {
  id: number;
  name: string;
  priceHour: number;
  priceDay: number;
  description: string;
}

export interface Accessory {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface Rental {
  id: number;
  bicycleId: number;
  userName: string;
  userPhone: string;
  userEmail?: string;
  fromDatetime: string;
  toDatetime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export interface OpeningHours {
  id: number;
  weekday: number;
  openTime: string;
  closeTime: string;
}

export interface ServiceBooking {
  id: number;
  date: string;
  userName: string;
  userPhone: string;
  description: string;
}

export interface ServiceCapacity {
  id: number;
  weekday: number;
  capacity: number;
}

export interface CreateRentalRequest {
  bicycleId: number;
  userName: string;
  userPhone: string;
  userEmail?: string;
  fromDatetime: string;
  toDatetime: string;
}
