import { hasOverlap } from './rentalRepository.js';
import { Accessory, Bicycle, listAccessories, listBicycles } from './catalogRepository.js';

function mapBicycle(row: Bicycle) {
  return {
    id: row.id,
    categoryId: row.category_id,
    templateId: row.template_id ?? undefined,
    name: row.name,
    description: row.description,
    recommendedFor: row.recommended_for,
    size: row.size,
    imageUrl: row.image_url,
    riderType: row.rider_type,
    status: row.status
  };
}

function mapAccessory(row: Accessory) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    imageUrl: row.image_url
  };
}

export interface AvailabilitySummary {
  men: number;
  women: number;
  children: number;
  accessories: Record<number, number>;
}

export interface AvailabilityListInput {
  from: string;
  to: string;
  needs: {
    men: number;
    women: number;
    children: number;
    accessories: Record<number, number>;
  };
}

export interface AvailabilityListResponse<TBike = Bicycle, TAccessory = Accessory> {
  men: TBike[];
  women: TBike[];
  children: TBike[];
  accessories: TAccessory[];
}

async function availableBicyclesByType(from: string, to: string) {
  const bicycles = await listBicycles();
  const men: Bicycle[] = [];
  const women: Bicycle[] = [];
  const children: Bicycle[] = [];

  for (const bicycle of bicycles) {
    const overlap = await hasOverlap(bicycle.id, from, to);
    if (overlap || bicycle.status !== 'active') {
      continue;
    }
    switch (bicycle.rider_type) {
      case 'men':
        men.push(bicycle);
        break;
      case 'women':
        women.push(bicycle);
        break;
      case 'children':
        children.push(bicycle);
        break;
    }
  }

  return { men, women, children } as const;
}

export async function availabilitySummary(from: string, to: string): Promise<AvailabilitySummary> {
  const { men, women, children } = await availableBicyclesByType(from, to);
  const accessories = await listAccessories();

  return {
    men: men.length,
    women: women.length,
    children: children.length,
    accessories: accessories.reduce<Record<number, number>>((acc, accessory) => {
      acc[accessory.id] = Number((accessory as any).quantity ?? 10);
      return acc;
    }, {})
  };
}

type ClientBicycle = ReturnType<typeof mapBicycle>;
type ClientAccessory = ReturnType<typeof mapAccessory>;

export async function availabilityList(
  payload: AvailabilityListInput
): Promise<AvailabilityListResponse<ClientBicycle, ClientAccessory>> {
  const { from, to, needs } = payload;
  const accessories = await listAccessories();
  const { men, women, children } = await availableBicyclesByType(from, to);

  if (children.length < needs.children) {
    throw new Error('not enough bikes');
  }

  const menFromMen = Math.min(needs.men, men.length);
  const menShortage = needs.men - menFromMen;
  const fallbackWomenForMen = Math.min(women.length, menShortage);
  if (menShortage > fallbackWomenForMen) {
    throw new Error('not enough bikes');
  }

  const reservedMen = men.slice(0, menFromMen);
  const remainingMenForFallback = men.slice(menFromMen);
  const reservedWomenForMen = women.slice(0, fallbackWomenForMen);
  const remainingWomenAfterFallback = women.slice(fallbackWomenForMen);

  const womenFromWomen = Math.min(needs.women, remainingWomenAfterFallback.length);
  const womenShortage = needs.women - womenFromWomen;
  const fallbackMenForWomen = Math.min(remainingMenForFallback.length, womenShortage);
  if (womenShortage > fallbackMenForWomen) {
    throw new Error('not enough bikes');
  }

  const reservedWomen = remainingWomenAfterFallback.slice(0, womenFromWomen);
  const reservedMenForWomen = remainingMenForFallback.slice(0, fallbackMenForWomen);

  const finalMenList = [...reservedMen, ...reservedWomenForMen];
  const finalWomenList = [...reservedWomen, ...reservedMenForWomen];
  const finalChildrenList = children.slice(0, needs.children);

  return {
    men: finalMenList.map(mapBicycle),
    women: finalWomenList.map(mapBicycle),
    children: finalChildrenList.map(mapBicycle),
    accessories: accessories.map(mapAccessory)
  };
}
