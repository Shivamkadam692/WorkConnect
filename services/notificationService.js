const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create and send a notification
  static async createNotification(data) {
    try {
      console.log('Creating notification with data:', data);
      const notification = new Notification(data);
      await notification.save();
      console.log('Notification saved:', notification._id);
      
      // Emit real-time notification via Socket.IO
      if (global.io) {
        console.log('Emitting notification to user:', data.recipient);
        global.io.to(`user_${data.recipient}`).emit('newNotification', {
          id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
      } else {
        console.log('Socket.IO not available');
      }
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create service request notification
  static async notifyServiceRequest(request, worker) {
    await request.populate(['service', 'client']);
    
    return await this.createNotification({
      recipient: worker._id,
      sender: request.client._id,
      type: 'service_request',
      title: 'New Service Request',
      message: `You have a new service request from ${request.client.name} for ${request.service.serviceType} at ${request.service.location}`,
      relatedRequest: request._id,
      relatedService: request.service._id,
      priority: 'high'
    });
  }

  // Create request accepted notification
  static async notifyRequestAccepted(request, client) {
    await request.populate(['service', 'worker']);
    
    return await this.createNotification({
      recipient: client._id,
      sender: request.worker._id,
      type: 'request_accepted',
      title: 'Service Request Accepted',
      message: `${request.worker.name} has accepted your service request for ${request.service.serviceType}`,
      relatedRequest: request._id,
      relatedService: request.service._id,
      priority: 'high'
    });
  }

  // Create request rejected notification
  static async notifyRequestRejected(request, client) {
    const service = await request.populate('service');
    const worker = await request.populate('worker');
    
    return await this.createNotification({
      recipient: client._id,
      sender: worker._id,
      type: 'request_rejected',
      title: 'Service Request Rejected',
      message: `${worker.name} has rejected your service request for ${service.serviceType}`,
      relatedRequest: request._id,
      relatedService: service._id,
      priority: 'medium'
    });
  }

  // Create service started notification
  static async notifyServiceStarted(request, client) {
    const service = await request.populate('service');
    const worker = await request.populate('worker');
    
    return await this.createNotification({
      recipient: client._id,
      sender: worker._id,
      type: 'service_started',
      title: 'Service Started',
      message: `${worker.name} has started your service for ${service.serviceType}`,
      relatedRequest: request._id,
      relatedService: service._id,
      priority: 'high'
    });
  }

  // Create service completed notification
  static async notifyServiceCompleted(request, client) {
    const service = await request.populate('service');
    const worker = await request.populate('worker');
    
    return await this.createNotification({
      recipient: client._id,
      sender: worker._id,
      type: 'service_completed',
      title: 'Service Completed',
      message: `${worker.name} has completed your service for ${service.serviceType}`,
      relatedRequest: request._id,
      relatedService: service._id,
      priority: 'high'
    });
  }

  // Create location update notification
  static async notifyLocationUpdate(request, role, otherUser) {
    const service = await request.populate('service');
    const isClient = role === 'client';
    
    return await this.createNotification({
      recipient: otherUser._id,
      sender: isClient ? request.client : request.worker,
      type: 'location_update',
      title: 'Location Updated',
      message: `${isClient ? 'Client' : 'Worker'} location has been updated for service ${service.serviceType}`,
      relatedRequest: request._id,
      relatedService: service._id,
      priority: 'low',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire in 24 hours
    });
  }

  // Create payment received notification
  static async notifyPaymentReceived(request, amount) {
    const service = await request.populate('service');
    const worker = await request.populate('worker');
    
    return await this.createNotification({
      recipient: worker._id,
      type: 'payment_received',
      title: 'Payment Received',
      message: `Payment of ₹${amount} has been received for service ${service.serviceType}`,
      relatedRequest: request._id,
      relatedService: service._id,
      priority: 'high'
    });
  }

  // Create system notification
  static async notifySystem(userId, title, message, priority = 'medium') {
    return await this.createNotification({
      recipient: userId,
      type: 'system',
      title,
      message,
      priority
    });
  }

  // Get user notifications
  static async getUserNotifications(userId, limit = 20, skip = 0) {
    return await Notification.find({ recipient: userId })
      .populate('sender', 'name')
      .populate('relatedRequest')
      .populate('relatedService')
      .populate('relatedLorry')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  // Get unread notification count
  static async getUnreadCount(userId) {
    return await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    return await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    return await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });
  }

  // Delete old notifications (older than 30 days)
  static async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true
    });
  }

  // Delete read notifications for a user
  static async deleteReadNotifications(userId) {
    return await Notification.deleteMany({
      recipient: userId,
      isRead: true
    });
  }
}

module.exports = NotificationService;
