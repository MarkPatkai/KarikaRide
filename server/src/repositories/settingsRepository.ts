import { getPool } from '../db.js';

export interface ContactInfo {
  id: number;
  email: string;
  phone: string;
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  const [rows] = await getPool().query('SELECT id, email, phone FROM contact_info ORDER BY id DESC LIMIT 1');
  const result = rows as ContactInfo[];
  return result[0] || null;
}

export async function saveContactInfo(email: string, phone: string): Promise<number> {
  const [result] = await getPool().execute('INSERT INTO contact_info (email, phone) VALUES (:email, :phone)', { email, phone });
  return (result as any).insertId as number;
}
