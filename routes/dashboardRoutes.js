const express = require('express');
const router = express.Router();
const { requireLogin, requireRole } = require('../middleware/auth');
const Request = require('../models/Request');
const Service = require('../models/Service');

const User = require('../models/User');
const Worker = require('../models/Worker');
// Consultation model removed - using Service model instead
const NotificationService = require('../services/notificationService');
const mongoose = require('mongoose');

// Client Dashboard
router.get('/client', requireLogin, requireRole('client'), async (req, res) => {
  try {
    const requests = await Request.find({ 
      client: req.session.userId
    })
      .populate('worker', 'name email')
      .populate('workerProfile', 'skills experience hourlyRate')
      .sort({ createdAt: -1 });
    
    res.render('clientDashboard', { requests });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading dashboard' });
  }
});

// Worker Dashboard
router.get('/worker', requireLogin, requireRole('worker'), async (req, res) => {
  try {
    const workers = await Worker.find({ worker: req.session.userId }).sort({ createdAt: -1 });
    const requests = await Request.find({ 
      worker: req.session.userId
    })
      .populate('client', 'name email')
      .populate('workerProfile', 'skills experience hourlyRate')
      .sort({ createdAt: -1 });
    
    res.render('workerDashboard', { workers, requests });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading dashboard' });
  }
});

// Live tracking page with access rules
router.get('/track/:requestId', requireLogin, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId)
      .populate('client', 'name')
      .populate('worker', 'name')
      .populate('workerProfile', 'skills experience');
    if (!request) return res.status(404).render('error', { message: 'Request not found' });

    const userId = req.session.userId?.toString();
    const isClient = request.client._id.toString() === userId;
    const isWorker = request.worker._id.toString() === userId;
    if (!isClient && !isWorker) {
      return res.status(403).render('error', { message: 'Unauthorized' });
    }

    // Access rules:
    // - Client: can access tracking from acceptance until completion
    // - Worker: can access client location until meeting started (loadedAt). After that, can still share own location for client to track
    if (isWorker && request.loadedAt) {
      // After starting, do not expose client location anymore
      request.clientLocation = undefined;
    }
    if (request.status === 'completed') {
      // After completion, no tracking access for either party
      return res.status(403).render('error', { message: 'Tracking is no longer available for this request' });
    }

    res.render('trackService', { request });
  } catch (e) {
    res.status(500).render('error', { message: 'Error loading tracking' });
  }
});

// Send request (client to worker)
router.post('/send-request', requireLogin, requireRole('client'), async (req, res, next) => {
  try {
    const { workerId, date, time, requirements } = req.body;
    
    // Validate required fields
    if (!workerId || !date || !time || !requirements) {
      const error = new Error('All fields are required');
      error.statusCode = 400;
      return next(error);
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      const error = new Error('Date cannot be in the past');
      error.statusCode = 400;
      return next(error);
    }
    
    // Find worker
    const worker = await Worker.findById(workerId).populate('worker');
    if (!worker) return res.status(404).render('error', { message: 'Worker not found' });
    if (worker.status !== 'available') return res.status(400).render('error', { message: 'Worker is not available' });
    
    // Create request with date, time, and requirements
    const request = new Request({
      client: req.session.userId,
      worker: worker.worker._id,
      workerProfile: workerId,
      status: 'pending',
      message: requirements,
      preferredDateTime: new Date(`${date}T${time}:00`)
    });
    
    await request.save();
    await Worker.findByIdAndUpdate(workerId, { $push: { requests: request._id } });
    
    try {
      await NotificationService.createNotification({
        recipient: worker.worker._id,
        sender: req.session.userId,
        type: 'request_received',
        title: 'New Request Received',
        message: `A client has sent you a request for ${date} at ${time}.`,
        relatedRequest: request._id,
        priority: 'high'
      });
    } catch {}
    
    req.flash('success', 'Request sent successfully!');
    return res.redirect('/dashboard/client');
  } catch (error) {
    next(error);
  }
});

// Accept request (worker)
router.post('/accept-request/:requestId', requireLogin, requireRole('worker'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) {
      return res.status(404).render('error', { message: 'Request not found' });
    }
    
    if (request.worker.toString() !== req.session.userId) {
      return res.status(403).render('error', { message: 'Unauthorized' });
    }
    
    await Request.findByIdAndUpdate(req.params.requestId, { status: 'accepted', acceptedAt: new Date() });
    await Worker.findByIdAndUpdate(request.workerProfile, { status: 'busy' });
    
    // Notify client that request was accepted
    try {
      const populated = await Request.findById(req.params.requestId).populate('client worker workerProfile');
      await NotificationService.createNotification({
        recipient: populated.client._id,
        sender: populated.worker._id,
        type: 'request_accepted',
        title: 'Your Request Was Accepted',
        message: `${populated.worker.name} accepted your request.`,
        relatedRequest: populated._id,
        priority: 'high'
      });
    } catch {}

    res.redirect('/dashboard/worker');
  } catch (error) {
    res.status(500).render('error', { message: 'Error accepting request' });
  }
});

// Reject request (worker)
router.post('/reject-request/:requestId', requireLogin, requireRole('worker'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) {
      return res.status(404).render('error', { message: 'Request not found' });
    }
    
    if (request.worker.toString() !== req.session.userId) {
      return res.status(403).render('error', { message: 'Unauthorized' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).render('error', { message: 'Request is no longer pending' });
    }
    
    await Request.findByIdAndUpdate(req.params.requestId, { status: 'rejected', rejectedAt: new Date() });
    
    // Notify client that request was rejected
    try {
      const populated = await Request.findById(req.params.requestId).populate('client worker workerProfile');
      await NotificationService.createNotification({
        recipient: populated.client._id,
        sender: populated.worker._id,
        type: 'request_rejected',
        title: 'Your Request Was Rejected',
        message: `Your request was rejected by ${populated.worker.name}.`,
        relatedRequest: populated._id,
        priority: 'medium'
      });
    } catch {}

    res.redirect('/dashboard/worker');
  } catch (error) {
    res.status(500).render('error', { message: 'Error rejecting request' });
  }
});

// Mark meeting started (called by worker after reaching client)
router.post('/mark-started/:requestId', requireLogin, requireRole('worker'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).render('error', { message: 'Request not found' });
    if (request.worker.toString() !== req.session.userId) {
      return res.status(403).render('error', { message: 'Unauthorized' });
    }
    await Request.findByIdAndUpdate(req.params.requestId, { loadedAt: new Date() });
    // Notify client that meeting has started
    try {
      const populated = await Request.findById(req.params.requestId).populate('client worker workerProfile');
      await NotificationService.createNotification({
        recipient: populated.client._id,
        sender: populated.worker._id,
        type: 'meeting_started',
        title: 'Meeting Started',
        message: `${populated.worker.name} has started the meeting.`,
        relatedRequest: populated._id,
        priority: 'medium'
      });
    } catch {}
    res.redirect('/dashboard/worker');
  } catch (e) {
    res.status(500).render('error', { message: 'Error updating status' });
  }
});

// Complete meeting (worker)
router.post('/complete-service/:requestId', requireLogin, requireRole('worker'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) {
      return res.status(404).render('error', { message: 'Request not found' });
    }
    
    if (request.worker.toString() !== req.session.userId) {
      return res.status(403).render('error', { message: 'Unauthorized' });
    }
    
    await Request.findByIdAndUpdate(req.params.requestId, { status: 'completed', completedAt: new Date(), trackingActiveClient: false, trackingActiveWorker: false });
    await Worker.findByIdAndUpdate(request.workerProfile, { status: 'available' });
    
    // Notify client that meeting completed
    try {
      const populated = await Request.findById(req.params.requestId).populate('client worker workerProfile');
      await NotificationService.createNotification({
        recipient: populated.client._id,
        sender: populated.worker._id,
        type: 'meeting_completed',
        title: 'Meeting Completed',
        message: `${populated.worker.name} completed the meeting.`,
        relatedRequest: populated._id,
        priority: 'high'
      });
    } catch {}
    res.redirect('/dashboard/worker');
  } catch (error) {
    res.status(500).render('error', { message: 'Error completing meeting' });
  }
});

  // Get messages for a request
  router.get('/requests/:requestId/messages', requireLogin, async (req, res) => {
    try {
      const request = await Request.findById(req.params.requestId).populate('messages.sender', 'name');
      if (!request) return res.status(404).json({ error: 'Request not found' });

      const userId = req.session.userId;
      if (request.client.toString() !== userId && request.worker.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json({ messages: request.messages });
    } catch (e) {
      res.status(500).json({ error: 'Error fetching messages' });
    }
  });

  // Post a message to a request (only between client and worker)
  router.post('/requests/:requestId/messages', requireLogin, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'Message text required' });

      const request = await Request.findById(req.params.requestId);
      if (!request) return res.status(404).json({ error: 'Request not found' });

      const userId = req.session.userId;
      if (request.client.toString() !== userId && request.worker.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Only allow messaging from acceptance until service completed/payment completed
      if (request.status !== 'accepted' && request.status !== 'in-progress' && request.status !== 'pending') {
        return res.status(400).json({ error: 'Messaging not allowed for this request status' });
      }

    const message = { sender: new mongoose.Types.ObjectId(userId), text };
      request.messages.push(message);
      await request.save();

      // Emit via Socket.IO to both parties in request room
      if (global.io) {
        global.io.to(request._id.toString()).emit('newMessage', {
          requestId: request._id,
          sender: userId,
          text,
          createdAt: new Date()
        });
      }

      res.json({ success: true });
    } catch (e) {
      console.error('Error posting message:', e);
      res.status(500).json({ error: 'Error posting message' });
    }
  });

module.exports = router;
