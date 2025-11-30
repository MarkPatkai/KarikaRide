import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config.js';
import {
  createAccessory,
  createBicycle,
  createCategory,
  createTemplate,
  deleteAccessory,
  deleteBicycle,
  deleteCategory,
  deleteTemplate,
  listAccessories,
  listBicycles,
  listCategories,
  listTemplates,
  updateAccessory,
  updateBicycle,
  updateCategory,
  updateTemplate
} from '../repositories/catalogRepository.js';
import { listRentalsToday, updateRentalStatus } from '../repositories/rentalRepository.js';
import {
  deleteOpeningHour,
  deleteServiceCapacity,
  listOpeningHours,
  listServiceCapacity,
  upsertOpeningHour,
  upsertServiceCapacity
} from '../repositories/serviceRepository.js';
import { getContactInfo, saveContactInfo } from '../repositories/settingsRepository.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== config.admin.username || password !== config.admin.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: '8h' });
  res.json({ token });
});

router.use(authenticate);

router.get('/categories', async (_req, res) => {
  res.json(await listCategories());
});

router.post('/categories', async (req, res) => {
  const { name, price_hour, price_day, description } = req.body;
  if (!name || price_hour === undefined || price_day === undefined) {
    return res.status(400).json({ message: 'name, price_hour, and price_day are required' });
  }
  const id = await createCategory({ name, price_hour, price_day, description: description || null });
  res.status(201).json({ id });
});

router.put('/categories/:id', async (req, res) => {
  await updateCategory(Number(req.params.id), req.body);
  res.status(204).send();
});

router.delete('/categories/:id', async (req, res) => {
  await deleteCategory(Number(req.params.id));
  res.status(204).send();
});

router.get('/templates', async (_req, res) => res.json(await listTemplates()));

router.post('/templates', async (req, res) => {
  const { name, description, recommended_for, size } = req.body;
  if (!name || !recommended_for || !size) {
    return res.status(400).json({ message: 'name, recommended_for, and size are required' });
  }
  const id = await createTemplate({ name, description: description || null, recommended_for, size });
  res.status(201).json({ id });
});

router.put('/templates/:id', async (req, res) => {
  await updateTemplate(Number(req.params.id), req.body);
  res.status(204).send();
});

router.delete('/templates/:id', async (req, res) => {
  await deleteTemplate(Number(req.params.id));
  res.status(204).send();
});

router.get('/bicycles', async (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  res.json(await listBicycles(categoryId));
});

router.post('/bicycles', async (req, res) => {
  const { category_id, template_id, name, description, recommended_for, size, image_url, status, rider_type } = req.body;
  if (!category_id || !name || !recommended_for || !size || !image_url) {
    return res.status(400).json({ message: 'category_id, name, recommended_for, size, image_url are required' });
  }
  const id = await createBicycle({
    category_id: Number(category_id),
    template_id: template_id ? Number(template_id) : null,
    name,
    description: description || null,
    recommended_for,
    size,
    image_url,
    rider_type: (rider_type as any) || 'men',
    status: status || 'active'
  });
  res.status(201).json({ id });
});

router.put('/bicycles/:id', async (req, res) => {
  await updateBicycle(Number(req.params.id), req.body);
  res.status(204).send();
});

router.delete('/bicycles/:id', async (req, res) => {
  await deleteBicycle(Number(req.params.id));
  res.status(204).send();
});

router.get('/accessories', async (_req, res) => res.json(await listAccessories()));

router.post('/accessories', async (req, res) => {
  const { name, price, description, image_url } = req.body;
  if (!name || price === undefined || !image_url) {
    return res.status(400).json({ message: 'name, price, and image_url are required' });
  }
  const id = await createAccessory({ name, price, description: description || null, image_url });
  res.status(201).json({ id });
});

router.put('/accessories/:id', async (req, res) => {
  await updateAccessory(Number(req.params.id), req.body);
  res.status(204).send();
});

router.delete('/accessories/:id', async (req, res) => {
  await deleteAccessory(Number(req.params.id));
  res.status(204).send();
});

router.get('/opening-hours', async (_req, res) => res.json(await listOpeningHours()));

router.post('/opening-hours', async (req, res) => {
  const { weekday, open_time, close_time } = req.body;
  if (weekday === undefined || !open_time || !close_time) {
    return res.status(400).json({ message: 'weekday, open_time, close_time are required' });
  }
  const id = await upsertOpeningHour({ weekday: Number(weekday), open_time, close_time });
  res.status(201).json({ id });
});

router.put('/opening-hours/:id', async (req, res) => {
  await upsertOpeningHour({ id: Number(req.params.id), ...req.body });
  res.status(204).send();
});

router.delete('/opening-hours/:id', async (req, res) => {
  await deleteOpeningHour(Number(req.params.id));
  res.status(204).send();
});

router.get('/service-capacity', async (_req, res) => res.json(await listServiceCapacity()));

router.post('/service-capacity', async (req, res) => {
  const { weekday, capacity } = req.body;
  if (weekday === undefined || capacity === undefined) {
    return res.status(400).json({ message: 'weekday and capacity are required' });
  }
  const id = await upsertServiceCapacity({ weekday: Number(weekday), capacity: Number(capacity) });
  res.status(201).json({ id });
});

router.put('/service-capacity/:id', async (req, res) => {
  await upsertServiceCapacity({ id: Number(req.params.id), ...req.body });
  res.status(204).send();
});

router.delete('/service-capacity/:id', async (req, res) => {
  await deleteServiceCapacity(Number(req.params.id));
  res.status(204).send();
});

router.get('/rentals/today', async (_req, res) => {
  res.json(await listRentalsToday());
});

router.put('/rental/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'status is required' });
  }
  await updateRentalStatus(Number(req.params.id), status);
  res.status(204).send();
});

router.get('/settings/contact-info', async (_req, res) => {
  const contact = await getContactInfo();
  res.json(contact);
});

router.post('/settings/contact-info', async (req, res) => {
  const { email, phone } = req.body;
  if (!email || !phone) {
    return res.status(400).json({ message: 'email and phone are required' });
  }
  const id = await saveContactInfo(String(email), String(phone));
  res.status(201).json({ id });
});

export default router;
