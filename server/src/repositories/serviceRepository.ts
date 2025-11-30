import { getPool } from '../db.js';

export interface OpeningHours {
  id: number;
  weekday: number;
  open_time: string;
  close_time: string;
}

export interface ServiceBooking {
  id: number;
  date: string;
  user_name: string;
  user_phone: string;
  description: string | null;
}

export interface ServiceCapacity {
  id: number;
  weekday: number;
  capacity: number;
}

export async function listOpeningHours(): Promise<OpeningHours[]> {
  const [rows] = await getPool().query('SELECT id, weekday, open_time, close_time FROM opening_hours');
  return rows as OpeningHours[];
}

export async function upsertOpeningHour(data: Omit<OpeningHours, 'id'> & { id?: number }): Promise<number> {
  if (data.id) {
    await getPool().execute(
      'UPDATE opening_hours SET weekday = :weekday, open_time = :open_time, close_time = :close_time WHERE id = :id',
      data
    );
    return data.id;
  }
  const [result] = await getPool().execute(
    'INSERT INTO opening_hours (weekday, open_time, close_time) VALUES (:weekday, :open_time, :close_time)',
    data
  );
  return (result as any).insertId;
}

export async function deleteOpeningHour(id: number): Promise<void> {
  await getPool().execute('DELETE FROM opening_hours WHERE id = :id', { id });
}

export async function listServiceBookingsByDate(date: string): Promise<ServiceBooking[]> {
  const [rows] = await getPool().query('SELECT id, date, user_name, user_phone, description FROM service_bookings WHERE date = :date', { date });
  return rows as ServiceBooking[];
}

export async function createServiceBooking(data: Omit<ServiceBooking, 'id'>): Promise<number> {
  const [result] = await getPool().execute(
    'INSERT INTO service_bookings (date, user_name, user_phone, description) VALUES (:date, :user_name, :user_phone, :description)',
    data
  );
  return (result as any).insertId;
}

export async function listServiceCapacity(): Promise<ServiceCapacity[]> {
  const [rows] = await getPool().query('SELECT id, weekday, capacity FROM service_capacity');
  return rows as ServiceCapacity[];
}

export async function upsertServiceCapacity(data: Omit<ServiceCapacity, 'id'> & { id?: number }): Promise<number> {
  if (data.id) {
    await getPool().execute('UPDATE service_capacity SET weekday = :weekday, capacity = :capacity WHERE id = :id', data);
    return data.id;
  }
  const [result] = await getPool().execute(
    'INSERT INTO service_capacity (weekday, capacity) VALUES (:weekday, :capacity)',
    data
  );
  return (result as any).insertId;
}

export async function deleteServiceCapacity(id: number): Promise<void> {
  await getPool().execute('DELETE FROM service_capacity WHERE id = :id', { id });
}

export async function remainingServiceCapacity(date: string): Promise<{ capacity: number; bookings: number; remaining: number } | null> {
  const pool = getPool();
  const [weekdayRows] = await pool.query('SELECT DAYOFWEEK(:date) as weekday', { date });
  const weekdayRecord = (weekdayRows as Array<{ weekday: number }>)[0];
  if (!weekdayRecord) {
    return null;
  }
  // MySQL DAYOFWEEK: 1=Sunday -> convert to 0 Monday
  const weekday = ((weekdayRecord.weekday + 5) % 7);
  const [capacityRows] = await pool.query('SELECT capacity FROM service_capacity WHERE weekday = :weekday', { weekday });
  const capacity = (capacityRows as Array<{ capacity: number }>)[0]?.capacity;
  if (capacity === undefined) {
    return null;
  }
  const [bookingRows] = await pool.query('SELECT COUNT(*) as count FROM service_bookings WHERE date = :date', { date });
  const bookings = (bookingRows as Array<{ count: number }>)[0]?.count || 0;
  return { capacity, bookings, remaining: Math.max(capacity - bookings, 0) };
}
