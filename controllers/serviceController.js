const Service = require('../models/Service');

/**
 * Render add service form
 */
exports.getAddService = (req, res) => {
  res.render('addService');
};

/**
 * Handle create service
 */
exports.postAddService = async (req, res, next) => {
  try {
    // Convert skillsRequired string to array if it's a string
    let skillsRequired = req.body.skillsRequired;
    if (typeof skillsRequired === 'string') {
      skillsRequired = skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill);
    }
    
    const serviceData = {
      ...req.body,
      client: req.session.userId,
      clientName: req.body.clientName || res.locals.user.name,
      skillsRequired: skillsRequired
    };
    
    await Service.create(serviceData);
    res.redirect('/dashboard/client');
  } catch (err) {
    next(err);
  }
};

/**
 * Get user's services
 */
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ client: req.session.userId }).sort({ createdAt: -1 });
    res.render('myServices', { services });
  } catch (error) {
    console.error('Error fetching my services:', error);
    res.status(500).render('error', { message: 'Error loading your services' });
  }
};

/**
 * Get single service by ID
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).render('error', { message: 'Service not found' });
    }
    res.render('service', { service });
  } catch (error) {
    res.status(500).render('error', { message: 'Error finding service' });
  }
};

/**
 * Render edit service form
 */
exports.getEditService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).render('error', { message: 'Service not found' });
    }
    res.render('editService', { service });
  } catch (error) {
    res.status(500).render('error', { message: 'Error finding service' });
  }
};

/**
 * Update service
 */
exports.updateService = async (req, res, next) => {
  try {
    // Check if service exists and belongs to the user
    const service = await Service.findById(req.params.id);
    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      return next(error);
    }
    
    if (service.client.toString() !== req.session.userId) {
      const error = new Error('Unauthorized - You can only edit your own services');
      error.statusCode = 403;
      return next(error);
    }
    
    // Convert skillsRequired string to array if it's a string
    let skillsRequired = req.body.skillsRequired;
    if (typeof skillsRequired === 'string') {
      skillsRequired = skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill);
      req.body.skillsRequired = skillsRequired;
    }
    
    await Service.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/services/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete service
 */
exports.deleteService = async (req, res, next) => {
  try {
    // Check if service exists and belongs to the user
    const service = await Service.findById(req.params.id);
    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      return next(error);
    }
    
    if (service.client.toString() !== req.session.userId) {
      const error = new Error('Unauthorized - You can only delete your own services');
      error.statusCode = 403;
      return next(error);
    }
    
    await Service.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};