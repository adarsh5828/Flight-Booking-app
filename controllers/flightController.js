import Flight from '../models/Flight.js';

// Create flight (admin only)
export const createFlight = async (req, res) => {
  const data = req.body;
  data.image = req.file ? `/uploads/${req.file.filename}` : undefined;
  data.createdBy = req.user._id;
  const flight = await Flight.create(data);
  res.status(201).json({ flight });
};

// Search / list flights (public)
export const getFlights = async (req, res) => {
  const { departureCity, arrivalCity, fromDate, toDate, minPrice, maxPrice, airline, flightClass, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (departureCity) filter.departureCity = { $regex: new RegExp(departureCity, 'i') };
  if (arrivalCity) filter.arrivalCity = { $regex: new RegExp(arrivalCity, 'i') };
  if (airline) filter.airline = { $regex: new RegExp(airline, 'i') };
  if (flightClass) filter.flightClass = flightClass;
  if (fromDate || toDate) filter.departureDate = {};
  if (fromDate) filter.departureDate.$gte = new Date(fromDate);
  if (toDate) filter.departureDate.$lte = new Date(toDate);
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);

  const flights = await Flight.find(filter).skip((page - 1) * limit).limit(Number(limit)).lean();
  res.json({ count: flights.length, flights });
};

// get by id (public)
export const getFlightById = async (req, res) => {
  const flight = await Flight.findById(req.params.id).populate('createdBy', 'name email');
  if (!flight) return res.status(404).json({ message: 'Flight not found' });
  res.json({ flight });
};

// update (admin)
export const updateFlight = async (req, res) => {
  const flight = await Flight.findById(req.params.id);
  if (!flight) return res.status(404).json({ message: 'Flight not found' });
  Object.assign(flight, req.body);
  if (req.file) flight.image = `/uploads/${req.file.filename}`;
  await flight.save();
  res.json({ flight });
};

// delete (admin)
export const deleteFlight = async (req, res) => {
  const flight = await Flight.findById(req.params.id);
  if (!flight) return res.status(404).json({ message: 'Flight not found' });
  await flight.remove();
  res.json({ message: 'Flight removed' });
};
