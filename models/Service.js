const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: String,
  contact: String,
  serviceType: String, // Type of service needed
  skillsRequired: [String], // Skills required for the service
  duration: Number, // Expected duration in hours
  location: String, // Client's location
  dateTime: { type: Date, required: true }, // Preferred date/time for service
  status: { type: String, enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  description: String,
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);