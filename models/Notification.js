const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
  enum: ['service_request', 'request_sent', 'request_accepted', 'request_rejected', 'service_started', 'service_completed', 'location_update', 'payment_received', 'work_complete', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  },
  relatedService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  relatedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Auto-delete expired notifications
notificationSchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    return next(new Error('Notification has expired'));
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
