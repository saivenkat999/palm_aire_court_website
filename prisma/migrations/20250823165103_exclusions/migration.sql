-- Enable btree_gist extension for exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Create indexes for better performance on date ranges
CREATE INDEX IF NOT EXISTS holds_unit_date_idx ON "Hold" USING gist ("unitId", "checkIn", "checkOut");
CREATE INDEX IF NOT EXISTS bookings_unit_date_idx ON "Booking" USING gist ("unitId", "checkIn", "checkOut");