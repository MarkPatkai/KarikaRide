import { getPool } from '../db.js';

export interface BicycleCategory {
  id: number;
  name: string;
  price_hour: number;
  price_day: number;
  description: string | null;
}

export interface BicycleTemplate {
  id: number;
  name: string;
  description: string | null;
  recommended_for: string;
  size: string;
}

export interface Bicycle {
  id: number;
  category_id: number;
  template_id: number | null;
  name: string;
  description: string | null;
  recommended_for: string;
  size: string;
  image_url: string;
  status: 'active' | 'inactive';
}

export interface Accessory {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string;
}

export async function listCategories(): Promise<BicycleCategory[]> {
  const [rows] = await getPool().query('SELECT id, name, price_hour, price_day, description FROM bicycle_categories');
  return rows as BicycleCategory[];
}

export async function createCategory(data: Omit<BicycleCategory, 'id'>): Promise<number> {
  const [result] = await getPool().execute(
    'INSERT INTO bicycle_categories (name, price_hour, price_day, description) VALUES (:name, :price_hour, :price_day, :description)',
    data
  );
  return (result as any).insertId;
}

export async function updateCategory(id: number, data: Partial<Omit<BicycleCategory, 'id'>>): Promise<void> {
  await getPool().execute(
    'UPDATE bicycle_categories SET name = COALESCE(:name, name), price_hour = COALESCE(:price_hour, price_hour), price_day = COALESCE(:price_day, price_day), description = COALESCE(:description, description) WHERE id = :id',
    { id, ...data }
  );
}

export async function deleteCategory(id: number): Promise<void> {
  await getPool().execute('DELETE FROM bicycle_categories WHERE id = :id', { id });
}

export async function listTemplates(): Promise<BicycleTemplate[]> {
  const [rows] = await getPool().query('SELECT id, name, description, recommended_for, size FROM bicycle_templates');
  return rows as BicycleTemplate[];
}

export async function createTemplate(data: Omit<BicycleTemplate, 'id'>): Promise<number> {
  const [result] = await getPool().execute(
    'INSERT INTO bicycle_templates (name, description, recommended_for, size) VALUES (:name, :description, :recommended_for, :size)',
    data
  );
  return (result as any).insertId;
}

export async function updateTemplate(id: number, data: Partial<Omit<BicycleTemplate, 'id'>>): Promise<void> {
  await getPool().execute(
    'UPDATE bicycle_templates SET name = COALESCE(:name, name), description = COALESCE(:description, description), recommended_for = COALESCE(:recommended_for, recommended_for), size = COALESCE(:size, size) WHERE id = :id',
    { id, ...data }
  );
}

export async function deleteTemplate(id: number): Promise<void> {
  await getPool().execute('DELETE FROM bicycle_templates WHERE id = :id', { id });
}

export async function listBicycles(categoryId?: number): Promise<Bicycle[]> {
  const pool = getPool();
  if (categoryId) {
    const [rows] = await pool.query(
      'SELECT id, category_id, template_id, name, description, recommended_for, size, image_url, status FROM bicycles WHERE category_id = :categoryId',
      { categoryId }
    );
    return rows as Bicycle[];
  }
  const [rows] = await pool.query(
    'SELECT id, category_id, template_id, name, description, recommended_for, size, image_url, status FROM bicycles'
  );
  return rows as Bicycle[];
}

export async function createBicycle(data: Omit<Bicycle, 'id'>): Promise<number> {
  const [result] = await getPool().execute(
    'INSERT INTO bicycles (category_id, template_id, name, description, recommended_for, size, image_url, status) VALUES (:category_id, :template_id, :name, :description, :recommended_for, :size, :image_url, :status)',
    data
  );
  return (result as any).insertId;
}

export async function updateBicycle(id: number, data: Partial<Omit<Bicycle, 'id'>>): Promise<void> {
  await getPool().execute(
    'UPDATE bicycles SET category_id = COALESCE(:category_id, category_id), template_id = :template_id, name = COALESCE(:name, name), description = COALESCE(:description, description), recommended_for = COALESCE(:recommended_for, recommended_for), size = COALESCE(:size, size), image_url = COALESCE(:image_url, image_url), status = COALESCE(:status, status) WHERE id = :id',
    { id, ...data }
  );
}

export async function deleteBicycle(id: number): Promise<void> {
  await getPool().execute('DELETE FROM bicycles WHERE id = :id', { id });
}

export async function listAccessories(): Promise<Accessory[]> {
  const [rows] = await getPool().query('SELECT id, name, price, description, image_url FROM accessories');
  return rows as Accessory[];
}

export async function createAccessory(data: Omit<Accessory, 'id'>): Promise<number> {
  const [result] = await getPool().execute(
    'INSERT INTO accessories (name, price, description, image_url) VALUES (:name, :price, :description, :image_url)',
    data
  );
  return (result as any).insertId;
}

export async function updateAccessory(id: number, data: Partial<Omit<Accessory, 'id'>>): Promise<void> {
  await getPool().execute(
    'UPDATE accessories SET name = COALESCE(:name, name), price = COALESCE(:price, price), description = COALESCE(:description, description), image_url = COALESCE(:image_url, image_url) WHERE id = :id',
    { id, ...data }
  );
}

export async function deleteAccessory(id: number): Promise<void> {
  await getPool().execute('DELETE FROM accessories WHERE id = :id', { id });
}
