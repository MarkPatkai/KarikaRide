import { Router } from 'express';
import {
  listBicycles,
  listCategories,
  listAccessories
} from '../repositories/catalogRepository.js';
import { createRental, hasOverlap } from '../repositories/rentalRepository.js';
import { createServiceBooking, remainingServiceCapacity } from '../repositories/serviceRepository.js';
import { availabilityList, availabilitySummary } from '../repositories/availabilityRepository.js';
import { getContactInfo } from '../repositories/settingsRepository.js';

const router = Router();

router.get('/categories', async (_req, res) => {
  const categories = await listCategories();
  res.json(categories);
});

router.get('/accessories', async (_req, res) => {
  const accessories = await listAccessories();
  res.json(accessories);
});

router.get('/bicycles', async (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const bicycles = await listBicycles(categoryId);
  res.json(bicycles);
});

router.get('/availability', async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ message: 'from and to are required ISO strings' });
  }
  const fromDate = String(from);
  const toDate = String(to);
  const bicycles = await listBicycles();
  const available = [];
  for (const bicycle of bicycles) {
    const overlap = await hasOverlap(bicycle.id, fromDate, toDate);
    if (!overlap) {
      available.push(bicycle);
    }
  }
  res.json(available);
});

router.post('/availability/summary', async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) {
    return res.status(400).json({ message: 'from and to are required ISO strings' });
  }
  const summary = await availabilitySummary(String(from), String(to));
  res.json(summary);
});

router.post('/availability/list', async (req, res) => {
  const { from, to, needs } = req.body;
  if (!from || !to || !needs) {
    return res.status(400).json({ message: 'from, to, and needs are required' });
  }

  try {
    const result = await availabilityList({
      from: String(from),
      to: String(to),
      needs: {
        men: Number(needs.men) || 0,
        women: Number(needs.women) || 0,
        children: Number(needs.children) || 0,
        accessories: needs.accessories || {}
      }
    });
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'not enough bikes') {
      return res.status(409).json({ error: 'not enough bikes' });
    }
    throw error;
  }
});

router.get('/contact-info', async (_req, res) => {
  const contact = await getContactInfo();
  if (!contact) {
    return res.status(404).json({ message: 'Contact info not configured' });
  }
  res.json(contact);
});

router.post('/rental', async (req, res) => {
  const { bicycleId, userName, userPhone, userEmail, fromDatetime, toDatetime } = req.body;
  if (!bicycleId || !userName || !userPhone || !fromDatetime || !toDatetime) {
    return res.status(400).json({ message: 'bicycleId, userName, userPhone, fromDatetime, toDatetime are required' });
  }
  const overlap = await hasOverlap(Number(bicycleId), String(fromDatetime), String(toDatetime));
  if (overlap) {
    return res.status(409).json({ message: 'Bicycle is not available for the requested period' });
  }
  const id = await createRental({
    bicycle_id: Number(bicycleId),
    user_name: String(userName),
    user_phone: String(userPhone),
    user_email: userEmail ? String(userEmail) : null,
    from_datetime: String(fromDatetime),
    to_datetime: String(toDatetime)
  });
  res.status(201).json({ id });
});

router.get('/service/capacity', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'date query param is required (YYYY-MM-DD)' });
  }
  const result = await remainingServiceCapacity(String(date));
  if (!result) {
    return res.status(404).json({ message: 'No capacity configured for requested date' });
  }
  res.json(result);
});

router.post('/service-booking', async (req, res) => {
  const { date, userName, userPhone, description } = req.body;
  if (!date || !userName || !userPhone) {
    return res.status(400).json({ message: 'date, userName, and userPhone are required' });
  }
  const capacity = await remainingServiceCapacity(String(date));
  if (!capacity || capacity.remaining <= 0) {
    return res.status(409).json({ message: 'No remaining capacity for the requested date' });
  }
  const id = await createServiceBooking({
    date: String(date),
    user_name: String(userName),
    user_phone: String(userPhone),
    description: description ? String(description) : null
  });
  res.status(201).json({ id });
});

export default router;
