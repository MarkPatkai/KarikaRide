import { getPool } from '../db.js';

export interface Rental {
  id: number;
  bicycle_id: number;
  user_name: string;
  user_phone: string;
  user_email?: string | null;
  from_datetime: string;
  to_datetime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export async function hasOverlap(bicycleId: number, from: string, to: string): Promise<boolean> {
  const [rows] = await getPool().query(
    `SELECT COUNT(*) as count FROM rentals
     WHERE bicycle_id = :bicycleId
       AND status = 'confirmed'
       AND NOT (to_datetime <= :from OR from_datetime >= :to)`,
    { bicycleId, from, to }
  );
  const result = rows as Array<{ count: number }>;
  return result[0]?.count > 0;
}

export async function createRental(data: Omit<Rental, 'id' | 'status'> & { status?: Rental['status'] }): Promise<number> {
  const payload = { status: 'confirmed', ...data } as Rental;
  const [result] = await getPool().execute(
    `INSERT INTO rentals (bicycle_id, user_name, user_phone, user_email, from_datetime, to_datetime, status)
     VALUES (:bicycle_id, :user_name, :user_phone, :user_email, :from_datetime, :to_datetime, :status)`,
    payload
  );
  return (result as any).insertId;
}

export async function listRentalsToday(): Promise<Rental[]> {
  const [rows] = await getPool().query(
    'SELECT id, bicycle_id, user_name, user_phone, user_email, from_datetime, to_datetime, status FROM rentals WHERE DATE(from_datetime) = CURDATE()'
  );
  return rows as Rental[];
}

export async function updateRentalStatus(id: number, status: Rental['status']): Promise<void> {
  await getPool().execute('UPDATE rentals SET status = :status WHERE id = :id', { id, status });
}

export async function listRentalByBicycle(bicycleId: number): Promise<Rental[]> {
  const [rows] = await getPool().query(
    'SELECT id, bicycle_id, user_name, user_phone, user_email, from_datetime, to_datetime, status FROM rentals WHERE bicycle_id = :bicycleId',
    { bicycleId }
  );
  return rows as Rental[];
}
