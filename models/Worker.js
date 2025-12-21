const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const workerSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerName: String,
  contact: String,
  skills: [String], // Array of skills instead of single vehicle type
  experience: Number, // Years of experience
  hourlyRate: Number, // Hourly rate for services
  location: String,
  coordinates: coordinateSchema, // Exact coordinates for map display
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  description: String,
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worker', workerSchema);