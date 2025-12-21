const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const requestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  workerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  price: Number,
  message: String,
  preferredDateTime: Date,
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  clientLocation: coordinateSchema,
  workerLocation: coordinateSchema,
  trackingActiveClient: { type: Boolean, default: false },
  trackingActiveWorker: { type: Boolean, default: false },
  acceptedAt: Date,
  rejectedAt: Date,
  loadedAt: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Request', requestSchema);
