const Worker = require('../models/Worker');
// Consultation model removed - using Service model instead
const fetch = require('node-fetch').default;

/**
 * Render add worker profile form
 */
exports.getAddWorker = (req, res) => {
  res.render('addWorker');
};

/**
 * Handle create worker profile
 */
exports.postAddWorker = async (req, res) => {
  try {
    // Convert skills string to array if it's a string
    let skills = req.body.skills;
    if (typeof skills === 'string') {
      skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }
    
    // Geocode location to get coordinates
    let coordinates = null;
    if (req.body.location) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.location)}&limit=1`);
        const data = await response.json();
        if (data && data[0]) {
          coordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError);
      }
    }
    
    const workerData = {
      ...req.body,
      worker: req.session.userId,
      workerName: req.body.workerName || res.locals.user.name,
      skills: skills,
      coordinates: coordinates
    };
    
    await Worker.create(workerData);
    res.redirect('/dashboard/worker');
  } catch (err) {
    console.error('Error creating worker profile:', err);
    res.status(500).render('error', { message: 'Error creating worker profile' });
  }
};

/**
 * Get user's worker profiles
 */
exports.getMyWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ worker: req.session.userId }).sort({ createdAt: -1 });
    res.render('myWorkers', { workers });
  } catch (error) {
    console.error('Error fetching my workers:', error);
    res.status(500).render('error', { message: 'Error loading your profiles' });
  }
};

/**
 * Get single worker by ID
 */
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).render('error', { message: 'Worker profile not found' });
    }
    
    // Find nearby workers based on worker location (for clients to see nearby options)
    const locationParts = worker.location.split(',');
    const locationQuery = locationParts.length > 0 ? locationParts[0].trim() : '';
    
    // Only search for nearby workers if we have a valid location query
    let nearbyWorkers = [];
    if (locationQuery && typeof locationQuery === 'string' && locationQuery.length > 0) {
      nearbyWorkers = await Worker.find({
        _id: { $ne: worker._id }, // Exclude current worker
        location: { $regex: locationQuery, $options: 'i' } // Match city/area part of the location
      }).limit(5);
    }
    
    res.render('worker', { worker, nearbyWorkers });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error finding worker profile or nearby workers' });
  }
};

/**
 * Render edit worker form
 */
exports.getEditWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      const error = new Error('Worker profile not found');
      error.statusCode = 404;
      return next(error);
    }
    
    // Check if the logged-in worker is the owner of the profile
    if (worker.worker.toString() !== req.session.userId) {
      const error = new Error('You are not authorized to edit this profile');
      error.statusCode = 403;
      return next(error);
    }
    
    res.render('editWorker', { worker });
  } catch (error) {
    next(error);
  }
};

/**
 * Update worker profile
 */
exports.updateWorker = async (req, res, next) => {
  try {
    // Find the worker first to check ownership
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      const error = new Error('Worker profile not found');
      error.statusCode = 404;
      return next(error);
    }
    
    // Check if the logged-in worker is the owner of the profile
    if (worker.worker.toString() !== req.session.userId) {
      const error = new Error('You are not authorized to update this profile');
      error.statusCode = 403;
      return next(error);
    }
    
    // Convert skills string to array if it's a string
    let skills = req.body.skills;
    if (typeof skills === 'string') {
      skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      req.body.skills = skills;
    }
    
    // Geocode location to get coordinates if location changed
    if (req.body.location && req.body.location !== worker.location) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.location)}&limit=1`);
        const data = await response.json();
        if (data && data[0]) {
          req.body.coordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError);
      }
    }
    
    await Worker.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/workers/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete worker profile
 */
exports.deleteWorker = async (req, res, next) => {
  try {
    // Find the worker first to check ownership
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      const error = new Error('Worker profile not found');
      error.statusCode = 404;
      return next(error);
    }
    
    // Check if the logged-in worker is the owner of the profile
    if (worker.worker.toString() !== req.session.userId) {
      const error = new Error('You are not authorized to delete this profile');
      error.statusCode = 403;
      return next(error);
    }
    
    await Worker.findByIdAndDelete(req.params.id);
    res.redirect('/workers/my');
  } catch (error) {
    next(error);
  }
};