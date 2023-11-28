-- Table create scripts here
-- Client Table
CREATE TABLE salon_schema.client(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(50) UNIQUE NOT NULL
);
-- Treatment Table
CREATE TABLE salon_schema.treatment(
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  code VARCHAR(50) NOT NULL,
  price DECIMAL(8,2) NOT NULL
);
-- Stylist Table
CREATE TABLE salon_schema.stylist(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  commission_percentage NUMERIC(3,2)
);
-- Booking Table
CREATE TABLE salon_schema.booking(
  id SERIAL PRIMARY KEY,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  client_id INT NOT NULL,
  treatment_id INT NOT NULL,
  stylist_id INT NOT NULL,
  FOREIGN KEY(client_id) REFERENCES salon_schema.client(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(treatment_id) REFERENCES salon_schema.treatment(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(stylist_id) REFERENCES salon_schema.stylist(id) ON UPDATE CASCADE ON DELETE CASCADE
);
