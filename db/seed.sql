-- Seed data for KarikaRide demo stack
USE karikaride;

INSERT INTO bicycle_categories (name, price_hour, price_day, description) VALUES
  ('City', 8.00, 25.00, 'Everyday city rides and quick errands.'),
  ('Mountain', 12.00, 35.00, 'Trail-friendly hardtails and full suspension options.');

INSERT INTO bicycle_templates (name, description, recommended_for, size) VALUES
  ('City Classic', 'Comfortable upright geometry with racks and lights.', 'Casual riders', 'M'),
  ('Trail Blazer', 'Hardtail with wide tires and disc brakes.', 'Off-road adventures', 'L');

INSERT INTO bicycles (category_id, template_id, name, description, recommended_for, size, image_url, rider_type, status) VALUES
  (1, 1, 'City Rider 3', 'Reliable 3-speed commuter with fenders.', 'Urban commutes', 'M', 'https://example.com/bikes/city-rider.jpg', 'men', 'active'),
  (2, 2, 'Summit Pro', 'Responsive hardtail ready for local trails.', 'Weekend trail rides', 'L', 'https://example.com/bikes/summit-pro.jpg', 'women', 'active');

INSERT INTO accessories (name, price, description, image_url) VALUES
  ('Helmet', 5.00, 'Certified safety helmet.', 'https://example.com/accessories/helmet.jpg'),
  ('Child Seat', 7.50, 'Rear child seat with harness.', 'https://example.com/accessories/child-seat.jpg');

INSERT INTO rentals (bicycle_id, user_name, user_phone, user_email, from_datetime, to_datetime, status) VALUES
  (1, 'Alice Demo', '+1234567890', 'alice@example.com', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 2 HOUR), 'confirmed');

INSERT INTO opening_hours (weekday, open_time, close_time) VALUES
  (0, '09:00', '18:00'),
  (1, '09:00', '18:00'),
  (2, '09:00', '18:00'),
  (3, '09:00', '18:00'),
  (4, '09:00', '18:00'),
  (5, '10:00', '16:00');

INSERT INTO service_capacity (weekday, capacity) VALUES
  (0, 4),
  (1, 4),
  (2, 4),
  (3, 4),
  (4, 4),
  (5, 2);

INSERT INTO contact_info (email, phone) VALUES ('rentals@karikaride.hu', '+36 30 111 2222');
